import React, { Component } from 'react';
import Search from './Search';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import RestaurantItem from './RestaurantItem';
import { getCityID, getRestaurantsByCityID, getCategories, getRestaurantsByCityIDAndCategories, getRestaurantsDetails } from './api.js';
 
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cityID: '',
      cityName: '',
      restaurantList: [],
      favoriteRestaurants: [],
      categoryList: [],
      categoryResultList: {},
    }
  }

  handleFaveToggle = (restaurant)=>{
    console.log('typeof restaurant', typeof restaurant)
    // if (typeof restaurant == 'object'){
    //   let newRestaurant = {'restaurant':restaurant}
    //   restaurant = newRestaurant
    // }
    const faves = this.state.favoriteRestaurants.slice();
    const restaurantIndex = faves.indexOf(restaurant);


    //If the restaurant is already in their favorites, take it out of the faves array.
    if (restaurantIndex >= 0) {
      // console.log(`Removing ${restaurant.name} from faves`);
      faves.splice(restaurantIndex, 1);
    } 
    //If the restaurant is not in their favorites, add it to the faves array.
    if (restaurantIndex === -1){
      // console.log(`Adding ${restaurant.name} to faves`);
      faves.push(restaurant);
    }
    this.setState({ 
      favoriteRestaurants: faves 
    })
  }

  randRestaurant = (restrauntArr) => {
    // console.log('randRestaurant',restrauntArr[Math.floor(Math.random() * restrauntArr.length)].restaurant )
    return restrauntArr[Math.floor(Math.random() * restrauntArr.length)].restaurant
  }

  handleCitySearchCriteria = async (searchValue, isRandom) => {
    console.log('Search value in App.js', searchValue);
    // console.log('isRandom value in App.js', isRandom);
    const results = await getCityID(searchValue);
    
    console.log(results.data.location_suggestions[0].id);

    const restaurantResults = await getRestaurantsByCityID(results.data.location_suggestions[0].id);

    this.setState({
      cityID: results.data.location_suggestions[0].id,
      cityName: results.data.location_suggestions[0].name,
      restaurantList: restaurantResults.data.restaurants,
      isRandom: isRandom
    });

    console.log(results);
  }

  handleRestaurantSearch = async (restaurantID) =>{
    console.log("restaurant ID", restaurantID);
    // console.log('isRandom value in App.js', isRandom);
    const results = await getRestaurantsDetails(restaurantID);
    
    console.log(results);

    this.setState({
      restaurantID: restaurantID,
      restaurantBody: results.data,
      restaurantName: results.data.name,
    });

    console.log(results);

  }

  handleCategorySearch = async () => {
    console.log('handleCategorySearch');

    const results = await getCategories();
    
    console.log("results.data.categories", results.data.categories);
    const categories = results.data.categories;

    this.setState({
      categoryList: categories,
    });
  }

  handleCitySearchCriteria = async (searchValue, isRandom) => {
    console.log('Search value in App.js', searchValue);

    let restaurantResults = [];
    let cityID = '';
    let cityName = '';
    if (searchValue == 'viewFavorites') {
      console.log('state in handlecitySearchcriteria', this.state)
      restaurantResults = this.state.favoriteRestaurants;
      cityID = 1;
      cityName = 'My Favorites';
      isRandom = false
    } else {
      if (searchValue !== '') {
        const results = await getCityID(searchValue);
        console.log(results.data.location_suggestions[0].id);
  
        if (Object.keys(this.state.categoryResultList) == null) {
          const restaurantResultsOutput = await getRestaurantsByCityID(results.data.location_suggestions[0].id);
          restaurantResults = restaurantResultsOutput.data.restaurants;
          cityID = results.data.location_suggestions[0].id;
          cityName = results.data.location_suggestions[0].name;
        }
        else {
          let keylist = Object.keys(this.state.categoryResultList).join();
          console.log("keylist", keylist);
  
          const restaurantResultsOutput = await getRestaurantsByCityIDAndCategories(results.data.location_suggestions[0].id, keylist);
          restaurantResults = restaurantResultsOutput.data.restaurants;
          cityID = results.data.location_suggestions[0].id;
          cityName = results.data.location_suggestions[0].name;
        }
  
      }
    }

    this.setState({
      cityID: cityID,
      cityName: cityName,
      restaurantList: restaurantResults,
      isRandom: isRandom
    });
  }

  handleCategoryResultList = (event) => {
    console.log('handleCategoryResultList', event.target); 
    console.log('handleCategoryResultList id', event.target.id);

    let tempObject = this.state.categoryResultList;

    if (tempObject[event.target.id] == true) {
      delete tempObject[event.target.id];
    }
    else {
      tempObject[event.target.id] = true;
    }

    this.setState({
      categoryResultList: tempObject
    });

    console.log("tempObject", tempObject);
  }
  
  render() {
    console.log("App.js render");
    console.log("this.state", this.state);
    console.log("App.js props", this.props);

    let restaurantComponent = '';
    if (this.state.cityID !== '') {
      if (this.state.isRandom) {
        console.log('this.randRestaurant(this.state.restaurantList)', this.randRestaurant(this.state.restaurantList))
        restaurantComponent = <RestaurantDetail restaurant={this.randRestaurant(this.state.restaurantList)} 
                                                cityID={this.state.cityID} 
                                                cityName={this.state.cityName} 
                                                onFaveToggle={this.handleFaveToggle}/>
      } else {
        restaurantComponent = <RestaurantList restaurantList={this.state.restaurantList} 
                                              cityID={this.state.cityID} 
                                              cityName={this.state.cityName} 
                                              favoriteRestaurants={this.state.favoriteRestaurants}
                                              handleRestaurantSearch={this.handleRestaurantSearch}  
                                              onFaveToggle={this.handleFaveToggle}
                                              />
      }
    }
    else {
      restaurantComponent = <h3>No Restaurants Listed</h3>
    }
    
    return (
      <>
      <div class="header">
        <h1 className='site-header'>Easy Pickin's</h1>
        <h3 className="subheader">Picking a restaurant, just got easy</h3>
         <Search  handleCitySearchCriteria={this.handleCitySearchCriteria} 
                  handleCategorySearch={this.handleCategorySearch} 
                  categoryList={this.state.categoryList} 
                  handleCategoryResultList={this.handleCategoryResultList}/>
        <h2>{this.state.cityName}</h2>
      </div>
      {(this.state.restaurantBody != null)?<RestaurantDetail name={this.state.restaurantName} restaurant={this.state.restaurantBody}/>:<h3></h3>}
      {restaurantComponent}
      </>
    );
  }

}


export default App;