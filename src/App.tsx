import React from 'react';
import {Trains} from "./client/components/Trains";
import {APIProvider, Map} from "@vis.gl/react-google-maps";
import './client/styles/appStyles.scss';
// import {TransitLayer} from "./client/components/TransitLayer";

function App() {
  return (
    <div className="App">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
        <Map
          defaultZoom={12}
          defaultCenter={{lat: 41.8781, lng: -87.7298}}
          mapId='cta-tracker'
        >
          {/*<TransitLayer/>*/}
          <Trains/>
        </Map>
      </APIProvider>
    </div>
  );
}

export default App;
