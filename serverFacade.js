import { SERVER_URL } from "./settings";
import { Base64 } from "js-base64";

ServerFacade = () => {
  async function getEvents(username, password) {
    let headers = new Headers();
    headers.set(
      "Authorization",
      //Basic Auth Login
      "Basic " + Base64.encode(username + ":" + password)
    );
    try {
      const url = `${SERVER_URL}/events/all/`;
      const status = await fetch(url, {
        method: "GET",
        headers: headers,
      }).then((res) => res.json());
      return status;
    } catch (err) {
      return false;
    }
  }

  async function getAddressFromCoordinates(lat, lon) {
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    try {
      const url = `${SERVER_URL}/geoaddress/converter/${lon}/${lat}`;
      const status = await fetch(url, {
        method: "GET",
        headers: headers,
      }).then((res) => res.json());
      return status;
    } catch (err) {
      return err;
    }
  }

  async function createEvent(username, eventInfo, date, time) {
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    try {
      const url = `${SERVER_URL}/events/create/`;
      const body = {
        user: username,
        road: eventInfo.streetName,
        house_number: eventInfo.streetNumber,
        postcode: eventInfo.cityCode,
        event_name: eventInfo.eventName,
        ticket_amount: Number(eventInfo.ticketAmount),
        ticket_price: Number(eventInfo.ticketPrice),
        date_time: date + " " + time,
      };
      const status = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
      }).then((res) => res.json());
      return status;
    } catch (err) {
      console.log("error", err);
      return err;
    }
  }

  return {
    getEvents,
    getAddressFromCoordinates,
    createEvent,
  };
};

export default ServerFacade();
