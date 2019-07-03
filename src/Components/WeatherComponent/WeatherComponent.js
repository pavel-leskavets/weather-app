import React, { Component } from "react";

class WeatherComponent extends Component {
  render() {
    const { country, city, temperature, humidity } = this.props;

    return (
      <div className="weather-card">
        <p>
          {city}, {country}
        </p>
        <p>Temperature: {temperature}</p>
        <p>Humidity: {humidity + "%"}</p>
      </div>
    );
  }
}
export default WeatherComponent;
