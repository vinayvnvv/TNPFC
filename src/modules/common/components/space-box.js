import React from 'react';
import { View } from 'native-base';

const SpaceBox = ({
    horizontal,
    vertical,
}) => {
    const styles = [];
    if(horizontal) styles.push({width: horizontal});
    if(vertical) styles.push({height: vertical});
    return (
        <View style={styles}/>
    );
}

export default SpaceBox;