import React, { Component } from "react";
import WeatherComponent from "../WeatherComponent/WeatherComponent";
import "./FormComponent.css";

class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      coords: "",
      keyOne: "a7b04520659f47bbb7f183955181912",
      keyTwo: "ef2666e3832e630f61b26d76484c4a1c",
      country: "",
      city: "",
      temperature: "",
      humidity: "",
      icon: "",
      radioGroup: {
        firstApi: false,
        secondApi: false
      }
    };
  }
  componentWillMount() {
    return navigator.geolocation.getCurrentPosition(location => {
      let coordinates =
        location.coords.latitude + "," + location.coords.longitude;
      let primaryUrl = `https://api.apixu.com/v1/current.json?key=${
        this.state.keyOne
      }&q=${coordinates}`;
      this.fetchWeather(primaryUrl);
    });
  }
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.fetchWeather();
    this.setState({ value: "" });
  };

  fetchWeather = async url => {
    if (!this.state.radioGroup.firstApi && !this.state.radioGroup.secondApi) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        this.setState({
          country: result.location.country,
          city: result.location.name,
          temperature: Math.round(result.current.temp_c) + "°C",
          humidity: result.current.humidity + "%",
          icon: result.current.condition.icon
        });
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    } else if (this.state.radioGroup.firstApi && this.state.value) {
      try {
        const response = await fetch(this.creatingQqueryString());
        const result = await response.json();
        this.setState({
          country: result.location.country,
          city: result.location.name,
          temperature: Math.round(result.current.temp_c) + "°C",
          humidity: result.current.humidity + "%",
          icon: result.current.condition.icon
        });
      } catch (error) {
        console.log(error);
      }
    } else if (this.state.radioGroup.secondApi && this.state.value) {
      try {
        const response = await fetch(this.creatingQqueryString());
        const result = await response.json();
        this.setState({
          country: result.sys.country,
          city: result.name,
          temperature: Math.round(result.main.temp - 273.15) + "°C",
          humidity: result.main.humidity + "%",
          icon: `http://openweathermap.org/img/w/${result.weather[0].icon +
            ".png"}`
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  handleRadio = e => {
    let object = {};
    object[e.target.value] = e.target.checked;
    this.setState({ radioGroup: object });
  };

  creatingQqueryString = () => {
    if (this.state.radioGroup.firstApi) {
      return `https://api.apixu.com/v1/current.json?key=${
        this.state.keyOne
      }&q=${this.state.value}`;
    } else if (this.state.radioGroup.secondApi) {
      return `https://api.openweathermap.org/data/2.5/weather?q=${
        this.state.value
      }&appid=${this.state.keyTwo}`;
    }
  };

  render() {
    return (
      <div className="form-component">
        <div className="change-form">
          <div className="search-input">
            <form onSubmit={this.handleSubmit} id="searchthis">
              <input
                type="text"
                id="search-box"
                placeholder="
                    Select weather service and enter title of city"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <button className="search-btn">Search</button>
            </form>
          </div>

          <div className="choice-of-service">
            <div className="service-input">
              <input
                type="radio"
                name="firstApi"
                id="one"
                value="firstApi"
                checked={!!this.state.radioGroup.firstApi}
                onChange={this.handleRadio}
              />
              <label htmlFor="one" className="input-label">
                {" "}
                Apixu
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="secondApi"
                id="two"
                value="secondApi"
                checked={!!this.state.radioGroup.secondApi}
                onChange={this.handleRadio}
              />
              <label htmlFor="two" className="input-label">
                {" "}
                OpenWeatherMap{" "}
              </label>
            </div>
          </div>
        </div>
        <WeatherComponent
          country={this.state.country}
          city={this.state.city}
          temperature={this.state.temperature}
          humidity={this.state.humidity}
          icon={this.state.icon}
        />
      </div>
    );
  }
}
export default FormComponent;
