import React, { Component } from "react";
import "./ChoiceServiceComponent.css";

export default class ChoiceServiceComponent extends Component {
  render() {
    return (
      <div className="service-input">
        <input
          type="radio"
          name={this.props.name}
          id={this.props.id}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <label htmlFor={this.props.id} className="input-label">
          {" "}
          {this.props.name}
        </label>
      </div>
    );
  }
}
