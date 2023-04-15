import React, { useContext, useRef, useState, useEffect } from "react";
import { FCContext } from "../Base";
export default function Login() {
  const { FC } = useContext(FCContext);
  const id = useRef(null);
  const [isRegistering, setIsRegistering] = useState(false);

  async function login(FC, id) {
    id = parseInt(id);

    await FC.isRegister(id).then((res) => {
      if (res) {
        FC.register(id)
          .then(setIsRegistering(true))
          .then(async () => {
            FC.on("registerSuccess", async () => {
              setIsRegistering(false);
              alert("注册成功");
              PubSub.publish("imgshow", true);
            });
          })
          .catch((e) => {
            setIsRegistering(false);
          });
      } else {
        FC.login(id).then((res) => {
          if (res) {
            PubSub.publish("loginSuccess");
          } else {
            alert("凭证ID或账户信息有误");
          }
        });
      }
    });
  }

  return (
    <div className="container" style={{ float: "right", paddingTop: "100px" }}>
      <div className="row">
        <div className="col-sm-4 col-md-offset-4">
          <div className="panel panel-info" style={{ width: "500px" }}>
            <div className="panel-heading">
              <div className="panel-title">
                <h3 style={{ fontWeight: "bolder", margin: "8px" }}>
                  登录/注册
                </h3>
              </div>
            </div>
            <div className="panel-body">
              <form acceptCharset="UTF-8" role="form">
                <fieldset>
                  <label htmlFor="username" style={{ float: "left" }}>
                    <h3 style={{ fontWeight: "bolder" }}>凭证ID/身份证号</h3>
                  </label>
                  <div className="form-group">
                    <input
                      ref={id}
                      style={{ height: "50px" }}
                      className="form-control"
                      placeholder="请输入凭证ID/身份证号"
                      name="name"
                      type="text"
                    ></input>
                  </div>

                  <input
                    onClick={() => {
                      login(FC, id.current.value);
                    }}
                    style={{ marginBottom: "20px" }}
                    className="btn btn-lg btn-success btn-block"
                    type="button"
                    disabled={isRegistering}
                    defaultValue={isRegistering ? "正在注册..." : "登录/注册"}
                  ></input>
                  <span className="text-success">
                    *若您尚未注册，点击以上按钮系统将为您自动注册*
                  </span>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
