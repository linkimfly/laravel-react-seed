import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;
import { BrowserRouter as Router, Route, Link, HashRouter, Redirect, Switch } from 'react-router-dom'
import styles from "./Main.css"

const Dashboard = function (){
  return(
    <h1>
        Dashboard
    </h1>
  )
}
const Menu1 = function (){
  return(
    <h1>
        Menu1
    </h1>
  )
}
const Menu2 = function (){
  return(
    <h1>
        Menu2
    </h1>
  )
}

class SiderLayout extends React.Component {
  render() {
    return (
      <HashRouter>
        <Layout className="layout">
          <Sider collapsible >
            <div className="layout__logo" />
            <Menu
              theme="dark"
              defaultSelectedKeys={this.menuAutoSelect()}>
              <Menu.Item key="dashboard">
                <Link to="/">
                  <Icon type="dashboard" />
                  <span>后台首页</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="menu1">
                <Link to="/menu1">
                  <Icon type="smile" />
                  <span>后台菜单1</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="menu2">
                <Link to="/menu2">
                  <Icon type="smile" />
                  <span>后台菜单2</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="exit">
                <a href="/">
                  <Icon type="logout" />
                  <span>退出后台</span>
                </a>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header className="layout__header">

            </Header>
            <Content className="layout__content">
              <Switch>
                <Route path="/" exact component={Dashboard}/>
                <Route path="/menu1" exact component={Menu1}/>
                <Route path="/menu2" exact component={Menu2}/>
                <Redirect to="/" />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
  //左侧菜单选中状态根据 url 自动转换
  menuAutoSelect() {
    let key = window.location.hash.split('/')[1];
    if (key=='' || !key) {
      key = 'dashboard';
    }
    return new Array(key);
  }
  //new function
}

//挂载根节点
if (document.getElementById('root')) {
    ReactDOM.render(<SiderLayout />, document.getElementById('root'));
}
