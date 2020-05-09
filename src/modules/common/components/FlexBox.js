import React from 'react';
import { View } from 'react-native';

const FlexBox = ({
    centered,
    children,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
}) => {
    const styles = [];
    if(centered) styles.push({alignItems: 'center', justifyContent: 'center'});
    if(height) styles.push({height});
    if(marginTop) styles.push({marginTop});
    if(marginBottom) styles.push({marginBottom});
    if(marginLeft) styles.push({marginLeft});
    if(marginRight) styles.push({marginRight});
    return (
        <View style={styles}>
            {children}
        </View>
    );
}
export default FlexBox;