import React from "react"
import styled from "styled-components"
import { CenteredContent, ResponsiveScroll } from "../../general/Layout"
import { Icon, Typography } from "antd"

const { Title } = Typography

const Section = styled.div`
  margin-bottom: 5em;
  h1,
  h2,
  h3,
  h4 {
    color: rgba(0, 0, 0, 0.65) !important;
  }
  h1 {
    font-weight: 350 !important;
    letter-spacing: 0.05em !important;
  }
  h4 {
    font-size: 1em !important;
  }
`

// const getGraphQLFetcher = (apiKey) => (graphQLParams) => {
//   const { user } = auth
//   return fetch(charityBaseGqlApiUri, {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: apiKey ? `Apikey ${apiKey}` : undefined,
//       UserId: user ? user.sub : undefined,
//     },
//     body: JSON.stringify(graphQLParams),
//   }).then((response) => response.json())
// }

// class Playground extends Component {
//   state = {
//     isApiKeyModalOpen: this.props.apiKey ? false : true,
//   }
//   handlePrettifyQuery = (event) => {
//     const editor = this.graphiqlComp.getQueryEditor()
//     editor.setValue(print(parse(editor.getValue())))
//   }
//   handleToggleHistory = () => {
//     this.graphiqlComp.setState((s) => ({
//       historyPaneOpen: !s.historyPaneOpen,
//     }))
//   }
//   render() {
//     const { apiKey, setApiKey } = this.props
//     const { isApiKeyModalOpen } = this.state
//     return (
//       <div className="api-explorer-container">
//         <GraphiQL
//           ref={(c) => {
//             this.graphiqlComp = c
//           }}
//           fetcher={getGraphQLFetcher(apiKey)}
//           defaultQuery={defaultQuery}
//         >
//           <GraphiQL.Logo>GraphiQL</GraphiQL.Logo>
//           <GraphiQL.Button label="test button" />
//           <GraphiQL.Toolbar>
//             <Button
//               onClick={this.handlePrettifyQuery}
//               title="Prettify Query (Shift-Ctrl-P)"
//               style={{ margin: "0 0.5em" }}
//             >
//               Prettify
//             </Button>
//             <Button
//               onClick={this.handleToggleHistory}
//               title="Show History"
//               style={{ margin: "0 0.5em" }}
//             >
//               History
//             </Button>
//             <Button
//               onClick={() => this.setState({ isApiKeyModalOpen: true })}
//               title="Set Authorization Header"
//               solid={apiKey || isApiKeyModalOpen ? false : true}
//               style={{ margin: "0 0.5em" }}
//             >
//               Set Auth Header
//             </Button>
//           </GraphiQL.Toolbar>
//         </GraphiQL>
//         <ApiKeyModal
//           currentKey={apiKey}
//           isOpen={isApiKeyModalOpen}
//           onChange={(apiKey) => {
//             setApiKey(apiKey)
//             this.setState({ isApiKeyModalOpen: false })
//           }}
//           onClose={() => this.setState({ isApiKeyModalOpen: false })}
//         />
//       </div>
//     )
//   }
// }
// Playground.propTypes = {
//   apiKey: PropTypes.string,
//   setApiKey: PropTypes.func.isRequired,
// }

// export default Playground

export default function() {
  return (
    <ResponsiveScroll>
      <CenteredContent>
        <Section>
          <Title>
            <Icon type="api" style={{ marginRight: "0.5em" }} />
            API Playground
          </Title>
        </Section>
        <Section>
          <p>
            The API playground has moved to{" "}
            <a href="https://charitybase.uk/api/graphql">
              https://charitybase.uk/api/graphql
            </a>
          </p>
        </Section>
      </CenteredContent>
    </ResponsiveScroll>
  )
}
