import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { desaturate, transparentize } from 'polished'
import GoogleMapReact from 'google-map-react'
import numeral from 'numeral'
import qs from 'query-string'
import { Menu } from 'antd'
import { fetchJSON } from '../../lib/fetchHelpers'
import { apiEndpoint, googleApiKey } from '../../lib/constants'
import { causes, operations, beneficiaries, funders } from '../../lib/filterValues'
import { fitBounds } from 'google-map-react/utils'
import geohash from 'ngeohash'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap } from 'recharts'

const formatMoney = x => numeral(x).format('($0a)').replace('$', '£')

const MarkerContainer = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  left: -25px;
  top: -25px;
`

const HoverableG = styled.g`
  fill: ${({ percentage }) => transparentize(0.3, desaturate(1-2*(percentage || 0), '#EC407A'))};
  :hover {
    fill: ${({ percentage }) => transparentize(0, desaturate(1-2*(percentage || 0), '#EC407A'))};
  }
`

const CharityMarker = ({ count, size, onClick, minWidth, maxWidth }) => (
  <MarkerContainer>
    <svg style={{ width: '50px', height: '50px', }}>
      <HoverableG
        onClick={onClick}
        percentage={size}
      >
        <circle
          cx='25px'
          cy='25px'
          r={Math.max(minWidth, Math.min(maxWidth, 30*Math.pow(size, 0.5)))}
        />
        <text x='25px' y='25px' textAnchor='middle' fill='#000' strokeWidth='0px' dy='.3em'>
          {count > 9999 ? '9999+' : count}
        </text>
      </HoverableG>
    </svg>
  </MarkerContainer>
)
CharityMarker.defaultProps = {
  minWidth: 10,
  maxWidth: 25,
}


class CharityMap extends Component {
  state = {
    zoom: this.props.zoom,
    center: this.props.center,
    zooming: false,
  }
  componentWillReceiveProps(nextProps) {
    const { isFreshSearch, center, zoom } = nextProps
    if (!isFreshSearch) {
      return
    }
    this.setState({ center, zoom })
  }
  render() {
    const { data, onBoundsChange, size, loading } = this.props
    const minCount = Math.min(...data.map(x => x.doc_count))
    const maxCount = Math.max(...data.map(x => x.doc_count))
    return (
      <div style={{ ...size, opacity: loading || this.state.zooming ? 0.5 : 1 }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: googleApiKey,
          }}
          zoom={this.state.zoom}
          center={this.state.center}
          options={{}}
          onChange={({ bounds, zoom, center }) => {
            onBoundsChange(bounds)
            this.setState({ zoom, center })
          }}
          onZoomAnimationStart={() => this.setState({ zooming: true })}
          onZoomAnimationEnd={() => this.setState({ zooming: false })}
        >
          {!this.state.zooming && data.sort((a,b) => a.doc_count - b.doc_count).map(x => {
            const size = maxCount > minCount ? (x.doc_count - minCount)/(maxCount - minCount) : 1
            const { latitude, longitude } = geohash.decode(x.key)
            return <CharityMarker
              key={x.key}
              count={x.doc_count}
              lat={latitude}
              lng={longitude}
              size={size}
              onClick={() => this.setState(s => ({
                zoom: s.zoom + 1,
                center: { lat: latitude, lng: longitude }
              }))}
            />
          })}
        </GoogleMapReact>
      </div>
    )
  }
}
CharityMap.propTypes = {
  data: PropTypes.array,
  onBoundsChange: PropTypes.func,
  center: PropTypes.object,
  zoom: PropTypes.number,
  size: PropTypes.object,
  isFreshSearch: PropTypes.bool,
  loading: PropTypes.bool,
}

const IncomeChart = ({ data }) => (
  <BarChart width={900} height={300} data={data}
      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
    <CartesianGrid strokeDasharray='3 3'/>
    <XAxis dataKey='name' label={{ value: 'Charity Size', offset: -5, position: 'insideBottom' }} />
    <YAxis yAxisId='left' tickFormatter={x => numeral(x).format('0,0')} orientation='left' stroke='#64B5F6'/>
    <YAxis yAxisId='right' tickFormatter={formatMoney} orientation='right' stroke='#81C784'/>
    <Tooltip labelFormatter={x => <div style={{fontSize: '18px', fontWeight: 500}}>{x}<hr/></div>} formatter={(value, name, props) => `${name[0] === '#' ? numeral(value).format('0,0') : formatMoney(value)}`}/>
    <Legend/>
    <Bar yAxisId='left' dataKey='# Charities' fill='#64B5F6' />
    <Bar yAxisId='left' dataKey='# Grants' fill='#1976D2' />
    <Bar yAxisId='right' dataKey='Total Income' fill='#81C784' />
    <Bar yAxisId='right' dataKey='Avg Grant' fill='#388E3C' />
    {false && <Bar yAxisId='left' dataKey='avg_grant_value' fill='red' />}
  </BarChart>
)
IncomeChart.propTypes = {
  data: PropTypes.array,
}


const RadialChart = ({ data }) => (
  <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
    <PolarGrid />
    <PolarAngleAxis dataKey='name' />
    <PolarRadiusAxis/>
    <Radar dataKey='doc_count' stroke='#EC407A' fill='#EC407A' fillOpacity={0.6}/>
  </RadarChart>
)
RadialChart.propTypes = {
  data: PropTypes.array,
}


const SimpleTreemap = ({ data }) => (
  <Treemap
    width={400}
    height={200}
    data={data}
    dataKey='size'
    ratio={4/3}
    stroke='#fff'
    fill='#EC407A'
  >
    <Tooltip formatter={(value, name, props) => props.payload.name} separator='' />
  </Treemap>
)
SimpleTreemap.propTypes = {
  data: PropTypes.array,
}


class CharitiesList extends Component {
  state = {
    selectedTab: 'locations',
    loading: true,
    data: [],
    geoBounds: null,
    isFreshSearch: false,
  }
  componentDidMount() {
    this.refreshSearch(this.props.queryString, null, true)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.queryString !== nextProps.queryString) {
      this.refreshSearch(nextProps.queryString, null, true)
    }
  }
  getGeoBoundsString = geoBoundsObj => geoBoundsObj ? `${geoBoundsObj.top_left.lat},${geoBoundsObj.top_left.lon},${geoBoundsObj.bottom_right.lat},${geoBoundsObj.bottom_right.lon}` : ''
  refreshSearch = (queryString, geoBounds, isFreshSearch) => {
    this.setState({
      loading: true,
      data: [],
    })
    this.getData(queryString, geoBounds, res => {
      this.setState({
        data: res.aggregations,
        loading: false,
        isFreshSearch,
        geoBounds: this.getGeoBoundsString(res.aggregations.addressLocation.map_zoom.bounds),
      })
    })
  }
  getData = (queryString, geoBounds, callback) => {
    const qs = queryString ? queryString.split('?')[1] + '&' : ''
    const url = `${apiEndpoint}/aggregate-charities?${qs}hasGrant=true&geoBounds=${geoBounds || ''}`
    fetchJSON(url)
    .then(res => callback(res))
    .catch(err => console.log(err))
  }
  onQueryUpdate = (key, value) => {
    const newQuery = { ...this.props.query, [key]: value || undefined }
    this.context.router.history.push(`?${qs.stringify(newQuery)}`)
  }
  onBoundsChange = geoBounds => {
    const geoBoundsString = `${geoBounds.nw.lat},${geoBounds.nw.lng},${geoBounds.se.lat},${geoBounds.se.lng}`
    if (geoBoundsString !== this.state.geoBounds) {
      this.refreshSearch(this.props.queryString, geoBoundsString, false)
    }
  }
  mapSize = { width: 600, height: 500 }
  getCenterZoom = boundingBox => {
    if (!boundingBox) return {}
    const { top_left, bottom_right } = boundingBox
    if (!top_left || !bottom_right) return {}
    const bounds = {
      nw: {
        lat: top_left.lat,
        lng: top_left.lon,
      },
      se: {
        lat: bottom_right.lat,
        lng: bottom_right.lon,
      }
    }
    const { center, zoom } = fitBounds(bounds, this.mapSize)
    return { center, zoom }
  }
  render() {
    const { loading, data } = this.state
    return (<div>
      <Menu
        onClick={e => this.setState({ selectedTab: e.key })}
        selectedKeys={[this.state.selectedTab]}
        mode='horizontal'
      >
        <Menu.Item key='size'>
          size
        </Menu.Item>
        <Menu.Item key='categories'>
          categories
        </Menu.Item>
        <Menu.Item key='funders'>
          funders
        </Menu.Item>
        <Menu.Item key='locations'>
          locations
        </Menu.Item>
      </Menu>
      {this.state.selectedTab === 'size' && <div>Size: {data.size && (
        <IncomeChart
          data={data.size.buckets.map(x => ({
            name: `${formatMoney(Math.pow(10, x.key))} - ${formatMoney(Math.pow(10, x.key+0.5))}`,
            '# Charities': x.doc_count,
            'Total Income': x.total_income.value,
            '# Grants': x.grants.filtered_grants.doc_count,
            'Avg Grant': x.grants.filtered_grants.grants_sum.value/x.grants.filtered_grants.doc_count,
            // avg_grant_value: x.total_granted.value/x.doc_count,
          }))}
        />
      )}</div>}
      {this.state.selectedTab === 'categories' && <div><div>Causes: {data.causes && (
        <RadialChart
          data={causes.filter(x => x.id !== 101 && x.id !== 117).sort((a,b) => a.id - b.id).map(x => ({
            name: `${x.altName}`,
            doc_count: (data.causes.buckets.find(c => c.key === x.id) || { doc_count: 0 }).doc_count,
          }))}
        />
      )}</div>
      <div>Beneficiaries: {data.beneficiaries && (
        <RadialChart
          data={beneficiaries.filter(x => x.id !== 206).sort((a,b) => a.key - b.key).map(x => ({
            name: `${x.altName}`,
            doc_count: (data.beneficiaries.buckets.find(c => c.key === x.id) || { doc_count: 0 }).doc_count,
          }))}
        />
      )}</div>
      <div>Operations: {data.operations && (
        <RadialChart
          data={operations.filter(x => x.id !== 310).sort((a,b) => a.key - b.key).map(x => ({
            name: `${x.altName}`,
            doc_count: (data.operations.buckets.find(c => c.key === x.id) || { doc_count: 0 }).doc_count,
          }))}
        />
      )}</div></div>}
      {this.state.selectedTab === 'funders' && <div># Grants: {data.funders && (
        <SimpleTreemap
          data={data.funders.filtered_grants.funders.buckets.map(x => ({
            name: `${(funders.find(f => f.id === x.key) || { name: 'Unknown' }).name}`,
            size: x.doc_count,
            value: x.total_awarded.value,
            avg: x.total_awarded.value/x.doc_count,
          }))}
        />
      )}</div>}
      {this.state.selectedTab === 'locations' && (
        <CharityMap
          data={data.addressLocation ? data.addressLocation.grid.buckets : []}
          onBoundsChange={this.onBoundsChange}
          isFreshSearch={this.state.isFreshSearch}
          {...this.getCenterZoom(data.addressLocation ? data.addressLocation.map_zoom.bounds : {})}
          size={this.mapSize}
          loading={loading}
       />
      )}
    </div>)
  }
}
CharitiesList.propTypes = {
  queryString: PropTypes.string,
  query: PropTypes.object,
}
CharitiesList.contextTypes = {
  router: PropTypes.object,
}

export { CharitiesList }
