import React, { Component } from "react";
import WeatherComponent from "../WeatherComponent/WeatherComponent";
import ChoiceServiceComponent from "../ChoiceServiceComponent/ChoiceServiceComponent";
import "./FormComponent.css";

class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      coords: "",
      type: "",
      keyOne: "a7b04520659f47bbb7f183955181912",
      keyTwo: "ef2666e3832e630f61b26d76484c4a1c",
      requestTime: 0,
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
    if (this.state.radioGroup.firstApi) {
      this.setState({ type: "firstApi" });
    } else if (this.state.radioGroup.secondApi) {
      this.setState({ type: "secondApi" });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.fetchWeather();
    this.setState({ value: "" });
  };

  fetchWeather = async url => {
    const TWO_HOURS = 7200000;
    let keyForLocalStorage = (
      this.state.value + this.state.type
    ).toLocaleLowerCase();
    let stateFromLocalStorage = JSON.parse(
      localStorage.getItem(keyForLocalStorage)
    );
    if (
      stateFromLocalStorage !== null &&
      Date.now() - stateFromLocalStorage.requestTime < TWO_HOURS
    ) {
      this.setState({
        country: stateFromLocalStorage.country,
        city: stateFromLocalStorage.city,
        temperature: stateFromLocalStorage.temperature,
        humidity: stateFromLocalStorage.humidity,
        icon: stateFromLocalStorage.icon,
        requestTime: stateFromLocalStorage.requestTime
      });
      return;
    }

    if (!this.state.radioGroup.firstApi && !this.state.radioGroup.secondApi) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        this.setState({
          country: result.location.country,
          city: result.location.name,
          temperature: Math.round(result.current.temp_c) + "°C",
          humidity: result.current.humidity + "%",
          icon: result.current.condition.icon,
          requestTime: Date.now()
        });
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
          icon: result.current.condition.icon,
          requestTime: Date.now()
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
            ".png"}`,
          requestTime: Date.now()
        });
      } catch (error) {
        console.log(error);
      }
    }
    this.localStorageSet();
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
  setTypeOfService = () => {
    if (this.state.radioGroup.firstApi) {
      this.setState({ type: "firstApi" });
    } else if (this.state.radioGroup.secondApi) {
      this.setState({ type: "secondApi" });
    }
  };
  localStorageSet = () => {
    let keyForLocalStorage = (
      this.state.city + this.state.type
    ).toLocaleLowerCase();
    let currentState = {
      city: this.state.city,
      country: this.state.country,
      temperature: this.state.temperature,
      humidity: this.state.humidity,
      icon: this.state.icon,
      requestTime: this.state.requestTime
    };
    localStorage.setItem(keyForLocalStorage, JSON.stringify(currentState));
  };
  render() {
    return (
      <div className="form-component" onClick={this.setTypeOfService}>
        <div className="change-form">
          <div className="search-input">
            <form onSubmit={this.handleSubmit} id="searchthis">
              <input
                type="text"
                id="search-box"
                placeholder="
                Enter the name of the city"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <button className="search-btn">Search</button>
            </form>
          </div>

          <div className="choice-of-service">
            <ChoiceServiceComponent
              name="Apixu"
              id="firstService"
              value="firstApi"
              checked={!!this.state.radioGroup.firstApi}
              onChange={this.handleRadio}
            />
            <ChoiceServiceComponent
              name="OpenWeatherMap"
              id="secondService"
              value="secondApi"
              checked={!!this.state.radioGroup.secondApi}
              onChange={this.handleRadio}
            />
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
