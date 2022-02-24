/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;

function initMap(): void {
  const hcm = new google.maps.LatLng(10.762622 , 106.660172);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: hcm,
    zoom: 15,
  });
  service = new google.maps.places.PlacesService(map);

  const request = {
    query: "3, Nguyễn Lương Bằng, Quận 7, Ho Chi Minh City, Vietnam",
    fields: ["name", "geometry", "place_id"],
  };


  service.findPlaceFromQuery(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }

        map.setCenter(results[0].geometry!.location!);
      }
    }
  );

}

function search(address: string) {
  const request = {
    query: address,
    fields: ["name", "geometry", "place_id"],
  };

  service.findPlaceFromQuery(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        detail(address, results[0]);
        return results[0];
      } else {
        const latlng = "Not Found"
        addLatLng(address, latlng);
      }
    }
  );
}

function createMarker(place: google.maps.places.PlaceResult) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

function detail(address: string, place: google.maps.places.PlaceResult) {
  const request = {
    placeId: place.place_id || "",
    fields: ["name", "formatted_address", "place_id", "geometry"]
  };
  service.getDetails(request, (place, status) => {
    if (
      status === google.maps.places.PlacesServiceStatus.OK &&
      place &&
      place.geometry &&
      place.geometry.location
    ) {
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      const latlng = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`
      addLatLng(address, latlng);
    } else {
      const latlng = "Not Found"
      addLatLng(address, latlng);
    }
  });
}

function addLatLng(address: string, latlng: string) {
  let output = document.getElementById('output') as HTMLInputElement;

  output.value += address + "\t" + latlng + "\n";
}

async function getAddress() {
  clearResult();

  const textArea = document.querySelector("#address") as HTMLInputElement;
  if (textArea) {
    const val = textArea.value;
    const lstAddress = val.split("\n");
    for (let address of lstAddress) {
      if (address) {
        search(address);
        await sleep(3000);
      }
    }
    let message = document.getElementById('message');
    var e = document.createElement('p');
    e.innerHTML = 'Done';
    message?.appendChild(e);
  }
}

function clearResult() {
  let output = document.getElementById('output') as HTMLInputElement;
  output.value = "";
  
  let message = document.getElementById('message');
  while (message?.firstChild) {
    message.removeChild(message.firstChild);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { initMap, getAddress };
