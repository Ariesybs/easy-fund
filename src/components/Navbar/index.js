import Head from "next/head";
import Link from "next/link";
import { ethers } from "ethers";
import PubSub from "pubsub-js";
import React, { useState, useEffect } from "react";

export default function Narbar() {
  const [imgShow, setImgshow] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [FC, setFC] = useState();
  const [reputation, setReputation] = useState(0);
  useEffect(() => {
    PubSub.publish("imgshow", imgShow);
  });

  useEffect(() => {
    const crowdfunding = require("../../../build/contracts/crowdfunding.json");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const FContract = new ethers.Contract(
      crowdfunding.networks[5777].address,
      JSON.stringify(crowdfunding.abi),
      signer
    );
    setFC(FContract);
    FContract.getReputation().then((res) => {
      setReputation(parseInt(res));
    });
    FContract.on("updateReputationSuccess", (newRuputation) => {
      setReputation(parseInt(newRuputation));
    });
  }, []);

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
              <img alt="Brand" src="/next.svg"></img>
            </a>
            <Link class="navbar-brand" href="/">
              EasyFund
            </Link>
          </div>
          <ul class="nav navbar-nav">
            <li class="active">
              <Link href="/">首页</Link>
            </li>
            <li>
              <Link href="/fund">发起众筹</Link>
            </li>
            <li>
              <a href="#">赞助</a>
            </li>
            <li>
              <a href="#">关于我们</a>
            </li>
          </ul>
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="搜索相关项目"
              ></input>
            </div>
            <button type="button" class="btn btn-default">
              搜索
            </button>
          </form>

          <ul
            class="nav navbar-nav navbar-right"
            style={{ paddingRight: "20px" }}
          >
            <li style={{ paddingRight: "10px" }}>
              <button
                class="btn btn-default navbar-btn"
                onClick={() => {
                  setImgshow(!imgShow);
                }}
              >
                <span class="glyphicon glyphicon-user"></span>
                {loginSuccess ? "退出登录" : "登录 / 注册"}
              </button>
            </li>
          </ul>
          <span className="navbar-right" style={{ paddingRight: "50px" }}>
            <h4 class="navbar-text " style={{ color: "white" }}>
              您当前的声誉分为：
              <span class="label label-success">{reputation}</span>
            </h4>
          </span>
        </div>
      </nav>
    </>
  );
}
