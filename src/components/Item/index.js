import React from "react";

export default function Item() {
  return (
    <div>
      <div class="col-sm-4">
        <div class="panel panel-primary">
          <div class="panel-heading">项目1</div>
          <div class="panel-body">
            <img
              src="/example.png"
              class="img-responsive"
              style={{ width: "100%" }}
              alt="Image"
            ></img>
            <h3>项目名称</h3>
            <p>项目类型</p>
            <p>项目描述</p>
            <div class="progress">
              <div
                class="progress-bar "
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: "10%", "min-width": "2em" }}
              >
                10%
              </div>
            </div>
            <p>
              <a href="fund.html" class="btn btn-primary" role="button">
                查看详情
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
