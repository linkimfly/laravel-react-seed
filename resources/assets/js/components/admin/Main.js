import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
const { Header, Sider, Content } = Layout;
import { BrowserRouter as Router, Route, Link, HashRouter, Redirect, Switch } from 'react-router-dom';
import News from './News/News';
import Slides from './Slides/Slides';
import Settings from './Settings/Settings';
import styles from "./Main.css";

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
              <Menu.Item key="news">
                <Link to="/news">
                  <Icon type="file-text" />
                  <span>新闻管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="slides">
                <Link to="/slides">
                  <Icon type="retweet" />
                  <span>轮播管理</span>
                </Link>
              </Menu.Item>
							{user.level == 'dev'?
								<Menu.Item key="settings">
	                <Link to="/settings">
	                  <Icon type="setting" />
	                  <span>设置中心</span>
	                </Link>
	              </Menu.Item>:''
							}
            </Menu>
          </Sider>
          <Layout>
            <Header className="layout__header">
              <div className="layout__header__right">
                <Dropdown overlay={menu}>
                  <a href="#">
                    <Avatar src={'images/default-avatar.png'} />
                    <span className="layout__header__right__name">username</span>
                  </a>
                </Dropdown>
              </div>
            </Header>
            <Content className="layout__content">
              <Switch>
                <Route path="/news" exact component={News}/>
								<Route path="/slides" exact component={Slides}/>
								{user.level == 'dev'?
									<Route path="/settings" exact component={Settings}/>:''
								}
                <Redirect to="/news" />
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
      key = 'news';
    }
    return new Array(key);
  }
  //new function
}

//头像下拉菜单处理
const avatarOnClick = function({key}){
  switch (key) {
    case 'logout':
      axios.post('logout')
      .then(function (response) {
        location.reload()
      })
      .catch(function (error) {
        console.log(error);
      });
      break;
    default: break;
  }
};
//头像下拉菜单
const menu = (
  <Menu onClick={avatarOnClick}>
    <Menu.Item key="version">
      <Icon type="crown" />
      <span>版本 0.0.0</span>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout">
      <Icon type="logout" />
      <span>退出登录</span>
    </Menu.Item>
  </Menu>
);

//挂载根节点
if (document.getElementById('root')) {
    ReactDOM.render(<SiderLayout />, document.getElementById('root'));
}
