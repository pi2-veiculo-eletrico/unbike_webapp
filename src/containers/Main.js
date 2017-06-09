/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * Router
 */
import {Actions} from 'react-native-router-flux'
import SideMenu from 'react-native-side-menu'
import Sidebar from 'react-native-sidebar'
/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header'

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'

import Polyline from '@mapbox/polyline'
/**
 * The components needed from React
 */
import React, {Component} from 'react'
import
{
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  ActionSheetIOS,
}
from 'react-native'

class ContentView extends React.Component {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text>
          Welcome to React Native!
        </Text>
        <Text>
          To get started, edit index.ios.js
        </Text>
        <Text>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
}

/**
 * The platform neutral button
 */
const Button = require('apsl-react-native-button')

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps (state) {
  return {
    auth: {
      form: {
        isFetching: state.auth.form.isFetching
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
}

/*
 * Bind all the actions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
  }
}

var styles = StyleSheet.create({
  button: {
    paddingTop: '20',
  },
  map: {
    flex: 1
  },
  container: {
    flexDirection: 'column',
    flex: 1
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
    marginLeft: 10,
    marginRight: 10
  }
})
/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations

/*<View style={styles.container}>
  <View>
    <Header isFetching={this.props.auth.form.isFetching}
      showState={this.props.global.showState}
      currentState={this.props.global.currentState}
      onGetState={this.props.actions.getState}
      onSetState={this.props.actions.setState} />

    <Button style={styles.button} onPress={this.handlePress.bind(this)}>
      {I18n.t('Main.navigate')}
    </Button>
  </View>
<MapView
styles={styles.mapview}/>
</View>*/

/**
 * ## App class
 */
 const { width, height } = Dimensions.get('window');

 const ASPECT_RATIO = width / height;
 const LATITUDE = -15.989215;
 const LONGITUDE = -48.0444642;
 const LATITUDE_DELTA = 0.005;
 const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
 const SPACE = 0.01;


class Main extends Component {



constructor(props) {
  super(props)
  this.state = {
    myPosition: null,
    route: null,
  }
}

componentDidMount() {
  navigator.geolocation.getCurrentPosition(
      (position) => {
        // var latitude = JSON.stringify(position.coords.latitude);
        // var longitude = JSON.stringify(position.coords.longitude);
        // Alert.alert(JSON.stringify(this.state.initialPosition.lat));
        const myPosition = position.coords;
        this.setState({ myPosition });
        // this.setState({initialPosition});
        // Alert.alert('position', initialPosition);
        // latitude = initialPosition.coords.latitude;
        // longitude = initialPosition.coords.longitude;

      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
}


  handlePress () {
    Actions.Subview({
      title: 'Subview'
      // you can add additional props to be passed to Subview here...
    })
  }


  clearRoute() {
    console.log('clearing route');
    this.setState({polylineCoords: null});
  }


  showActionSheet() {
 ActionSheetIOS.showActionSheetWithOptions({
   options: ['Traçar Rota','Cancelar'],
   cancelButtonIndex: 1,
 },
 (buttonIndex) => {
   if(buttonIndex==0){

     var fromCoords = {
       lat: LATITUDE,
       lng: LONGITUDE
     };

     var toCoords = this.state.route;

     console.log('###');
     console.log(fromCoords);
     console.log(toCoords);
     console.log('###');



  var url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking&';
      url += 'origin=' + fromCoords.lat + ',' + fromCoords.lng;
      url += '&destination=' + toCoords.lat + ',' + toCoords.lng;
      url += '&key=AIzaSyD0j-zx2ELBrwoIXbjyT1eRsl6rJ0XXgG4';

    return new Promise((resolve, reject) => {;
      fetch(url)
      .then((response) => {
        return response.json();
      }).then((json) => {
        resolve(json);
        var points = json.routes[0].overview_polyline.points;
        var steps = Polyline.decode(points);
        var polylineCoords = [];

        for (let i=0; i < steps.length; i++) {
          let tempLocation = {
            latitude : steps[i][0],
            longitude : steps[i][1]
          }
          polylineCoords.push(tempLocation);
        }
        console.log(polylineCoords);
        this.setState({
          polylineCoords,
        })



      }).catch((err) => {
        reject(err);
      });
    });


   }
 });
}

  render () {



    const { myPosition, route, polylineCoords } = this.state;
    const coordinate = myPosition;
    return (
      <MapView.Animated
        style={styles.map}
        mapType='satellite'
        region={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onPress={e=>{
          this.setState({
            route: {
              lat: e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
            }
          });
          this.showActionSheet();
        }}
        showUserLocation={true}
        followsUserLocation={true}
      >
        <MapView.Marker
          coordinate={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
          }}
         />
         <MapView.Polyline
         coordinates={this.state.polylineCoords}
         strokeWidth={2}
         strokeColor="red"
        />
      </MapView.Animated>
    )
  }
}

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main)
