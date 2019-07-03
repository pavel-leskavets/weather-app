import React, { Component } from "react";
import "./WeatherComponent.css";
class WeatherComponent extends Component {
  render() {
    const { country, city, temperature, humidity, icon } = this.props;

    return (
      <div className="weather-card">
        <div className="weather-card-info">
          <p>
            {city}, {country}
          </p>
          <p>Temperature: {temperature}</p>
          <p>Humidity: {humidity}</p>
        </div>

        <div className="weather-card-image">
          <img src={icon} alt="icon-logo" className="weather-icon-image" />
        </div>
      </div>
    );
  }
}
export default WeatherComponent;
