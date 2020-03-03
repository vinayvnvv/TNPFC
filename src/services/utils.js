import moment from 'moment';
class Utils {
    getAppCommonDateFormat(date) {
        return moment().format('DD-MMM-YYYY');
    }
    getBoxShadow(radius, color, opacity) {
        return {
            shadowColor: color ? color : '#d9d9d9',
            shadowRadius: radius ? radius : 0,
            shadowOpacity: opacity ? opacity : 0.5,
            elevation: radius ? radius : 0,
            position: 'relative',
            backgroundColor: color ? color : '#d9d9d9',
        }
    }

    getPieChartAsHTML(slices) {
        let cumulativePercent = 0;

        function getCoordinatesForPercent(percent) {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        }
        let p = '';
        slices.forEach(slice => {
            // destructuring assignment sets the two variables at once
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            
            // each slice starts where the last slice ended, so keep a cumulative percent
            cumulativePercent += slice.percent;
            
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > .5 ? 1 : 0;
            console.log('startX', startX);
            console.log('startY', startY);
            console.log('endX', endX);
            console.log('endY', endY);
            console.log('largeArcFlag', largeArcFlag);
            console.log(startX, startY, endX, endY, '-----')

            let xTextPos = ((startX + endX + largeArcFlag) / 3);
            let yTextPos = ((startY + endY + largeArcFlag) / 3);
            if(largeArcFlag === 1) {
                xTextPos = xTextPos * -1;
                yTextPos = yTextPos * -1;
            }

                // create an array and join it just for code readability
            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');
            p = p + `<path d="${pathData}" fill="${slice.color}"></path>`;
            p = p + `<text x="${xTextPos}" y="${yTextPos}" fill="#fff" style='font-size: 0.2'>${parseInt(slice.percent * 100)}%</text>`
        });
        return `<html>
                    <head>
                        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                    </head>
                    <body>
                        <svg width="200" height="200" viewBox="-1 -1 2 2">${p}</svg>
                    </body>
                </html>`;
        }
}

export default new Utils();