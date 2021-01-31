import React from "react"
import PropTypes from "prop-types"
import { NavLink } from "react-router-dom"
import { Menu } from "antd"

const subMenuChcKey = (x) => `submenu_chc_${x}`
const subMenuChcFinancesKey = (x) => `submenu_chc_finances_${x}`

const NavMenu = ({ chcIds }) => {
  return (
    <Menu
      selectable={false}
      mode="inline"
      openKeys={[
        "submenu_chc",
        ...chcIds.map(subMenuChcKey),
        ...chcIds.map(subMenuChcFinancesKey),
        "submenu_api",
        "submenu_about",
      ]}
      style={{ borderStyle: "none" }}
      theme="dark"
    >
      <Menu.SubMenu key="submenu_chc" title="England & Wales">
        <Menu.Item key="chc_search">
          <NavLink
            to={`/chc`}
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Search Charities
          </NavLink>
        </Menu.Item>
        {chcIds.map((x) => (
          <Menu.SubMenu key={subMenuChcKey(x)} title={`Charity ${x}`}>
            <Menu.Item key={`menu_item_chc_overview_${x}`}>
              <NavLink
                to={`/chc/${x}`}
                exact={true}
                activeStyle={{
                  color: "#EC407A",
                }}
              >
                Overview
              </NavLink>
            </Menu.Item>
            <Menu.SubMenu key={subMenuChcFinancesKey(x)} title="Finances">
              <Menu.Item key={`menu_item_chc_income_${x}`}>
                <NavLink
                  to={`/chc/${x}/finances`}
                  exact={true}
                  activeStyle={{
                    color: "#EC407A",
                  }}
                >
                  Income & Spending
                </NavLink>
              </Menu.Item>
              <Menu.Item key={`menu_item_chc_grants_${x}`}>
                <NavLink
                  to={`/chc/${x}/finances/grants`}
                  exact={true}
                  activeStyle={{
                    color: "#EC407A",
                  }}
                >
                  Public Grants
                </NavLink>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="submenu_api" title="API">
        <Menu.Item key="menu_item_api_portal_docs">
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://charitybase.uk/docs"
          >
            Docs (new)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20"
              height="20"
              style={{ marginLeft: "6px", marginBottom: "-3px" }}
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </Menu.Item>
        {/* <Menu.Item key="menu_item_api_portal_overview">
          <NavLink
            to={`/api-portal`}
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Getting Started
          </NavLink>
        </Menu.Item> */}
        <Menu.Item key="menu_item_api_portal_keys">
          <NavLink
            to={`/api-portal/keys`}
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            API Keys
          </NavLink>
        </Menu.Item>
        {/* <Menu.Item key="menu_item_api_portal_playground">
          <NavLink
            to={`/api-portal/playground`}
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Playground
          </NavLink>
        </Menu.Item> */}
      </Menu.SubMenu>
      <Menu.SubMenu key="submenu_about" title="About">
        <Menu.Item key="menu_item_about_what-is-it">
          <NavLink
            to="/about/what-is-it"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            What is CharityBase?
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_who-uses-it">
          <NavLink
            to="/about/who-uses-it"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Who uses CharityBase?
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_download">
          <NavLink
            to="/about/download"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Can I Download the Data?
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_other-countries">
          <NavLink
            to="/about/other-countries"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            What about other countries?
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_who-makes-it">
          <NavLink
            to="/about/who-makes-it"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Who's behind it?
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_thanks">
          <NavLink
            to="/about/thanks"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Acknowledgements
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_contact">
          <NavLink
            to="/about/contact"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Contact
          </NavLink>
        </Menu.Item>
        <Menu.Item key="menu_item_about_licence">
          <NavLink
            to="/about/licence"
            exact={true}
            activeStyle={{
              color: "#EC407A",
            }}
          >
            Licence
          </NavLink>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )
}
NavMenu.propTypes = {
  chcIds: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default NavMenu
