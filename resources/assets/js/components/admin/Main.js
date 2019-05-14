import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Dropdown, Avatar, LocaleProvider, message } from 'antd';
const { Header, Sider, Content } = Layout;
import { BrowserRouter as Router, Route, Link, HashRouter, Redirect, Switch } from 'react-router-dom';
import News from './News/News';
import Slide from './Slide/Slide';
import Setting from './Setting/Setting';
import styles from "./Main.css";
import zhCN from 'antd/lib/locale-provider/zh_CN';

class SiderLayout extends React.Component {
	state = {
		collapsed: false,
	}
  render() {
    return (
			<LocaleProvider locale={zhCN}>
	      <HashRouter>
	        <Layout className="layout">
	          <Sider collapsible trigger={null} collapsed={this.state.collapsed} width={210}>
	            <div className="layout__sider__logo">
								<img src="/images/logo.svg" alt="logo"/>
								{this.state.collapsed ? '' : <span>SPACE CAT</span>}
							</div>
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
		                <Link to="/settings/types">
		                  <Icon type="setting" />
		                  <span>设置中心</span>
		                </Link>
		              </Menu.Item>:''
								}
	            </Menu>
	          </Sider>
	          <Layout>
	            <Header className="layout__header">
								<Icon
									className="layout__header__collapsed"
		              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
		              onClick={this.toggle}
		            />
	              <div className="layout__header__right">
	                <Dropdown overlay={menu}>
	                  <a href="#">
	                    <Avatar src={'images/default-avatar.png'} />
	                    <span className="layout__header__right__name">{window.user.name}</span>
	                  </a>
	                </Dropdown>
	              </div>
	            </Header>
	            <Content className="layout__content">
	              <Switch>
	                <Route path="/news" exact component={News}/>
									<Route path="/slides" exact component={Slide}/>

									{user.level == 'dev'?<Route path="/settings/:module" exact component={Setting}/>:''}

	                <Redirect to="/news" />
	              </Switch>
	            </Content>
	          </Layout>
	        </Layout>
	      </HashRouter>
			</LocaleProvider>
    );
  }

	toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

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
			message.loading('正在退出登录，请稍后 ...');
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
