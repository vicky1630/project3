import React, { Component } from 'react';
// import { getRestaurantsByCityID } from './api.js';
import RestaurantItem from './RestaurantItem.js';
// import Favorite from './Favorite'

class RestaurantList extends Component {
    constructor(props) {
        super(props);
      }

    render() {
        console.log("RestaurantList render this.props", this.props);

        const allRestaurants = this.props.restaurantList.map((entry, index) => {
            // console.log(index, entry.restaurant.name);
            return <RestaurantItem  key={index} 
                                    restaurant={entry.restaurant} 
                                    onFaveToggle={() => this.props.onFaveToggle(entry.restaurant)}
                                     />
        });
        
        return (
            <ul>
                {allRestaurants}
            </ul>
        );
    }
}

export default RestaurantList;