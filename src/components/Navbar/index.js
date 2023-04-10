import Head from "next/head";
import React from "react";
Head;
export default function Narbar() {
  return (
    <>
      <nav
        class="navbar navbar-inverse"
        style={{
          position: "fixed",
          zIndex: "999",
          left: "0",
          right: "0",
          top: "0",
        }}
      >
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">
              EasyFund
            </a>
          </div>
          <ul class="nav navbar-nav">
            <li class="active">
              <a href="#">首页</a>
            </li>
            <li>
              <a href="#">项目</a>
            </li>
            <li>
              <a href="#">赞助</a>
            </li>
            <li>
              <a href="#">关于我们</a>
            </li>
          </ul>
          <ul
            class="nav navbar-nav navbar-right"
            style={{ paddingRight: "20px" }}
          >
            <li style={{ paddingRight: "10px" }}>
              <button class="btn btn-default navbar-btn">
                <span class="glyphicon glyphicon-user"></span> 注册
              </button>
            </li>
            <li>
              <button class="btn btn-default navbar-btn">
                <span class="glyphicon glyphicon-log-in"></span> 登录
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
