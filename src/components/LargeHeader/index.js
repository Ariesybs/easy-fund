import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Login from "../Login";
import PubSub from "pubsub-js";
export default function LargeHeader() {
  const [isOn, setIsOn] = useState(true);
  useEffect(() => {
    PubSub.subscribe("imgshow", (_, data) => {
      setIsOn(data);
    });
  }, []);
  return (
    <div>
      <div
        class="jumbotron"
        style={{
          backgroundColor: "rgb(25, 27, 3)",
          textAlign: "center",
          height: "600px",
        }}
      >
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={isOn}
            classNames={"image"}
            timeout={1000}
            unmountOnExit={true}
            appear
          >
            {isOn ? (
              <img
                src={"/Crowdfunding.webp"}
                style={{
                  float: "right",
                  paddingRight: "15px",
                  borderRadius: "15px",
                }}
              ></img>
            ) : (
              <Login />
            )}
          </CSSTransition>
        </SwitchTransition>

        <div
          style={{
            width: "900px",
            paddingRight: "20px",
            paddingTop: "50px",
            paddingLeft: "50px",
          }}
        >
          <h1
            style={{
              color: "rgba(255, 196, 0, 0.966)",
              "font-weight": "bolder",
            }}
          >
            Welcome to EasyFund
          </h1>
          <p style={{ color: "white", paddingTop: "20px" }}>
            欢迎来到EasyFund众筹平台，本平台不涉及任何中心化机构，您可以自由地为需要帮助的人伸出援助之手，如果您需要发起众筹，请点击下列按钮
          </p>
          <p style={{ color: "white" }}>
            Welcome to the EasyFund crowdfunding platform. This platform does
            not involve any centralized organization. You are free to lend a
            helping hand to those in need. If you need to initiate crowdfunding,
            please click the following button
          </p>
          <p style={{ paddingTop: "10px" }}>
            <Link
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: "rgba(255, 196, 0, 0.966)",
                color: "black",
                borderRadius: "10px",
              }}
              href="/fund"
              role="button"
            >
              <strong>发起众筹</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
