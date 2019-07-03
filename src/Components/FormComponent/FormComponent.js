import React, { Component } from "react";
import WeatherComponent from "../WeatherComponent/WeatherComponent";

class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      type: "",
      coords: "",
      keyOne: "a7b04520659f47bbb7f183955181912",
      keyTwo: "ef2666e3832e630f61b26d76484c4a1c",
      country: "",
      city: "",
      temperature: "",
      humidity: "",
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
      this.setState({ type: "first-service" });
    } else if (this.state.radioGroup.secondApi) {
      this.setState({ type: "second-service" });
    }
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
          temperature: result.current.temp_c + "°C",
          humidity: result.current.humidity
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
          temperature: result.current.temp_c + "°C",
          humidity: result.current.humidity
        });
      } catch (error) {
        console.log(error);
      }
    } else if (this.state.radioGroup.secondApi && this.state.value) {
      try {
        const response = await fetch(this.creatingQqueryString());
        const result = await response.json();
        this.setState({ current: result.main });
        this.setState({ additional: result.weather[0] });
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
      <div>
        <div className="change-form">
          <div className="form">
            <form onSubmit={this.handleSubmit} id="searchthis">
              <input
                type="text"
                id="search-box"
                placeholder="
                    Select weather service and enter title of city"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <button>search</button>
            </form>
          </div>

          <div className="card">
            <div>
              <input
                type="radio"
                name="firstApi"
                id="one"
                value="firstApi"
                checked={!!this.state.radioGroup.firstApi}
                onChange={this.handleRadio}
              />
              <label htmlFor="one"> Apixu.com</label>
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
              <label htmlFor="two"> openweathermap.org </label>
            </div>
          </div>
        </div>
        <WeatherComponent
          country={this.state.country}
          city={this.state.city}
          temperature={this.state.temperature}
          humidity={this.state.humidity}
        />
      </div>
    );
  }
}
export default FormComponent;
