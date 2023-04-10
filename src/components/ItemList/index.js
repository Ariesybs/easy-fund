import React from "react";
import Item from "../Item";
export default function ItenList() {
  return (
    <div>
      <div class="container">
        <div class="page-header">
          <h1>
            众筹项目<small>crowdfunding project</small>
          </h1>
        </div>

        <div class="row">
          <Item />
          <Item />
          <Item />
        </div>
      </div>
    </div>
  );
}
