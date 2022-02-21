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

  const request = {
    query: "562 Nguyen Van Cu, P. Gia Thuy, Long Bien District, Hanoi",
    fields: ["name", "geometry", "place_id"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
          detail(results[i]);
        }

        map.setCenter(results[0].geometry!.location!);
      }
    }
  );

}

function detail(place: google.maps.places.PlaceResult) {
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

      console.log(place.geometry.location.lat() + ", " + place.geometry.location.lng());
    }
  });
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

function getAddress() : [string] {
  const textArea = document.getElementById("address")?.ariaValueText;
  console.log(textArea);
  let address = "";
  return [""];
}

export { initMap, getAddress };
