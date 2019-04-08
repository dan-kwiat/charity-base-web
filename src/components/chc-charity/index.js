import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Layout, Typography } from 'antd'
import { GET_CHARITY } from '../../lib/gql'
import { ContentLayout } from '../general/Layout'
import CharityOverview from './CharityOverview'

const {
  Content, Footer, Sider,
} = Layout

const {
  Title,
} = Typography

const SIDER_WIDTH = 240

const Charity = ({ id }) => {
  return (
    <Query
      query={GET_CHARITY}
      variables={{ id }}
    >
      {({ loading, error, data, fetchMore }) => {
        if (error) return 'oops err'
        if (loading) return 'loading'
        const charity = (data && data.CHC && data.CHC.getCharities.list[0]) || null
        return charity ? (
          <Layout>
            <Sider
              width={SIDER_WIDTH}
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <div>side bar content here</div>
            </Sider>
            <ContentLayout>
              <div style={{
                boxShadow: '0 0 1em',
                zIndex: 2,
                padding: '1em',
              }}>
                <Title level={2}>
                  {charity.names.reduce((agg, x) => (x.primary ? x.value : agg), null)}
                </Title>
              </div>
              <Content style={{
                background: '#fff',
                margin: '0 0 0 0',
                overflow: 'initial',
                zIndex: 1,
                position: 'relative',
                height: '100%',
              }}>

                <CharityOverview {...charity} />
              </Content>
              <Footer style={{
                background: '#fafafa',
                textAlign: 'center',
                padding: '0.5em 1em',
                fontSize: '0.8em',
                lineHight: '0.8em',
              }}>
                CharityBase 2019 - created open source by <a href='https://worthwhile.app'>worthwhile.app</a>
              </Footer>
            </ContentLayout>
          </Layout>
        ) : (
          <div>Failed to find a charity with id {id}. Insert CharityBaseSearch component here.</div>
        )
      }}
    </Query>
  )
}
Charity.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Charity