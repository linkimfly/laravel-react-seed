import React, { Component } from 'react';
import { Layout, Menu, Form, Input, Button } from 'antd';
const { Sider, Content } = Layout;
const FormItem = Form.Item;
import { Route, Link } from 'react-router-dom'
import { SettingType } from './SettingType';

export default class Setting extends React.Component {
  render(){
    return (
      <div>
        <Menu
          mode="horizontal"
          selectedKeys={[this.props.match.params.module]}>
          <Menu.Item key="types">
            <Link to="/settings/types">
              分类设置
            </Link>
          </Menu.Item>
        </Menu>
        <Route path="/settings/types" exact component={SettingType}/>
      </div>
    )
  }
  //new function
}
