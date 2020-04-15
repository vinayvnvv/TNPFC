import React from 'react';
import { View, Text, Container } from 'native-base';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import PDFView from 'react-native-view-pdf';
// import Pdf from 'react-native-pdf';

// import RNFetchBlob from 'react-native-fetch-blob'
if(Platform.OS === 'web') {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
}
class Test extends React.Component {
    state = {
        basePdf: null,
    }
    componentDidMount() {
        this.pdf();
    }
    pdf = () => {
    }
    render() {
        const {basePdf} = this.state;
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            
        
            
            <div class="header-s">
                <img src="data:image/png;base64,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"/>
                <div class="header">
                    <h3 class="ttl">Tamil Nadu Power Finance and Infrastructure Development Corporation Limited</h3>
                    <br/>
                    <div class="sub_ttl" style="margin-top: -11px">(A Government of Tamil Nadu Undertaking)</div>
                    <div class="sub_ttl">No.490/3-4, Anna Salai, Nandanam, <br/>Chennai – 600 035</div>
                    <div class="sub_ttl">Phone : 044 - 2432 9945 / 24329946</div>
                    <div class="sub-ttl"><b>E-mail: power@tnpowerfnance.com</b></div>
                    <div class="sub-ttl"><b>Website: https://tnpowerfnance.com</b></div>
                </div>
                <div class="welce">
                    Wed Apr 15 2020 and 21:46:58 GMT+0530 (India Standard Time)<br/>
                    Dear ABDUL RAHMAN QURAISHI M D<br/>
                    Thank you for your interest in opening a Fixed Deposit with TNPFC.
                </div>
                <center>
                    <table>
                        <tbody>
                           <tr>
                               <td>Deposit Amount</td>
                               <td>Rs. 25,000</td>
                           </tr>
                           <tr>
                                <td>Scheme Type</td>
                                <td>201</td>
                            </tr>
                            <tr>
                                <td>Duration</td>
                                <td>24 months</td>
                            </tr>
                            <tr>
                                <td> Interest Rate</td>
                                <td>7.8 %</td>
                            </tr>
                            <tr>
                                <td>Interest Frequency</td>
                                <td>90</td>
                            </tr>
                            <tr>
                                <td>Maturity Amount</td>
                                <td>Rs 28,900</td>
                            </tr>
                        </tbody>
                    </table>
                </center>
                <div class="inf">
                    Kindly initiate RTGS/NEFT/IMPS remittance from your bank to the unique virtual account number
                    created for your request to open and activate your Fixed Deposit Account in Tamil Nadu Power
                    Finance and Infrastructure Development Corporation (TNPFCL).
                </div>
                <h3>Remittance Details</h3>
                <table style="width: 100%;">
                    <tbody>
                       <tr>
                           <td>Benefciary Account Number</td>
                           <td>TNPFCL1586967417431368</td>
                       </tr>
                       <tr>
                            <td>Amount to be remitted</td>
                            <td>Rs. 25,000</td>
                        </tr>
                        <tr>
                            <td>Amount in Words</td>
                            <td>Twenty Five Thousand Rupees Only</td>
                        </tr>
                        <tr>
                            <td>Benefciary Bank</td>
                            <td>HDFC</td>
                        </tr>
                        <tr>
                            <td>IFSC Code </td>
                            <td>HDFC0000082</td>
                        </tr>
                        <tr>
                            <td>Name of Benefciary Account</td>
                            <td>TAMILNADU POWER FIN AND INF DEV COR</td>
                        </tr>
                        <tr>
                            <td>Payment Reference/Narration</td>
                            <td>New FD</td>
                        </tr>
                    </tbody>
                </table>
                <h3 style="text-align: left">Payment Advice Terms and Conditions</h3>
                <ul>
                    <li>Deposit value would be for actual payment received</li>
                    <li>Payment Realization date would be considered the date of deposit</li>
                    <li>Only single payment to be made per payment advice</li>
                    <li>Payment advice is valid for two business days</li>
                    <li>Electronic fxed deposit receipt confrmation would be notifed through SMS and Depositors
                        may also login to the web portal or mobile application to download electronic fxed deposit
                        receipt.</li>
                    <li>For detailed Terms and Conditions of RIPS and CIPS, visit https://tnpowerfnance.com</li>
                </ul>
            </div>
        </body>
        
        <style>
            body {
                margin: 0 auto;
                padding: 21px;
            }
            .flex {
                display: flex;
            }
            .header-s {
                text-align: center;
            }
            .sub_ttl {
                font-size: 17px;
                margin-bottom: 4px;
            }
            .welce {
                text-align: left;
                font-size: 15px;
                margin: 18px 0px;
                line-height: 1.5;
            }
            table {
                border-collapse: collapse;
                margin: 11px 0px;
            }
            tr > td {
                border: 1px solid #444;
                padding: 9px;
                font-size: 13px;
            }
            tr > td:first-child {
                font-weight: bold;
            }
            tr > td:last-child {
               text-align: right;
            }
            .inf {
                font-size: 13px;
                margin: 5px 0px;
                text-align: left;
            }
            ul {
                text-align: left;
                padding: 0px;
                margin: 0 11px;
            }
            li {
                margin: 3px 0px;
                font-size: 14px;
            }
        </style>
        </html>`;
      console.log(html);
        return (
            <Container>
                <Text>visdasdsaddny</Text>
                <WebView style={{width: '100%', height: 300}} source={{html}} />
                <Text>viny</Text>
                {Platform.OS === 'web' && (
                    <div dangerouslySetInnerHTML={{__html: html}}></div>
                )}
                {/* {basePdf && ( */}
                    
                    {/* <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1 }}
                        resource={basePdf}
                        resourceType={'base64'}
                        onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                        onError={() => console.log('Cannot render PDF', error)}
                        /> */}
                        {/* <Pdf
                            source={{uri: 'data:application/pdf;base64,' + basePdf}}
                            onLoadComplete={(numberOfPages,filePath)=>{
                                console.log(`number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page,numberOfPages)=>{
                                console.log(`current page: ${page}`);
                            }}
                            onError={(error)=>{
                                console.log(error);
                            }}
                            onPressLink={(uri)=>{
                                console.log(`Link presse: ${uri}`)
                            }}/> */}
                {/* )} */}
            </Container>
        );
    }
}

export default Test;