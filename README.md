[![Build status](https://travis-ci.org/DoubleTrade/custom-scrollbar.svg?branch=master)](https://travis-ci.org/DoubleTrade/custom-gmap-infowindow)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/doubletrade/custom-gmap-infowindow)

## &lt;custom-gmap-infowindow&gt;

Currently (as of August 2017) the google-map component infowindow does not support event handlers ([#288](https://github.com/GoogleWebComponents/google-map/issues/288)) and CSS style classes due to shadow DOM restrictions.

`custom-gmap-infowindow` provides a simple and customizable infowindow element for google-map web component.

This component is a fork from [`plastic-map-info`](https://github.com/mlisook/plastic-map-info) by [@mislook](https://github.com/mlisook)

### Install

`bower install DoubleTrade/custom-gmap-infowindow`

- [See demo](https://doubletrade.github.io/custom-gmap-infowindow/components/custom-gmap-infowindow/demo/)
- [See docs](https://doubletrade.github.io/custom-gmap-infowindow/)


### Browser support

Chrome, Firefox, IE 11+/, Edge, Safari.


### Styling

`<custom-gmap-infowndow>` provides the following custom properties and mixins for styling:

Custom property                              | Description                                         | Default
---------------------------------------------|-----------------------------------------------------|----------
`--custom-gmap-infowindow`                   | Mixin applied to the infowindow                     | `{position: absolute;z-index: 99;width: 300px;top: 0;left: 0;background-color: white;box-sizing: border-box;padding: 30px 15px 15px 15px;border-radius: 2px;color: black; visibility: hidden;}`
`--custom-gmap-infowindow-caret-size`        | Mixin applied to the infowindow bottom caret        | `15px`
`--custom-gmap-infowindow-caret-color`       | Mixin applied to the infowindow bottom caret        | `#fff`
`--custom-gmap-infowindow-caret-border-size` | Mixin applied to the infowindow bottom caret border | `17px`
`--custom-gmap-infowindow-caret-border-color`| Mixin applied to the infowindow bottom caret border | `rgba(0, 0, 0, 0.3)`

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="custom-gmap-infowindow.html">
    <link rel="import" href="../google-map/google-map.html">
    <link rel="import" href="../paper-button/paper-button.html">
    <style is="custom-style">
      google-map {
        height: 500px;
        width: 100%;
      }

      custom-gmap-infowindow  paper-button {
        background: var(--primary-color);
        color: #fff;
        width: 100%;
        margin: 0;
      }

      custom-gmap-infowindow h3 {
        margin: 0 0 5px 0;
      }

    </style>
    <script>
    document.addEventListener('google-map-marker-click', (event) => {
      document.querySelector('custom-gmap-infowindow').showInfoWindow(event.srcElement.marker);
    });

    function handleClick() {
      alert('Event handler is working, yo !');
    }
    </script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<google-map click-events fit-to-markers api-key="AIzaSyD3E1D9b-Z7ekrT3tbhl_dy8DCXuIuDDRc">
  <google-map-marker click-events slot="markers" latitude="49.183333" longitude="-0.350000"></google-map-marker>
  <custom-gmap-infowindow hide-marker-on-click>
    <div class="layout vertical">
      <h3>Caen</h3>
      <img src="https://www.normandyalacarte.com/wp-content/uploads/2016/05/880px-Normandie_Calvados_Caen1_tango7174-300x100.jpg" width="300" height="100">
      <p>Caen is a commune in northwestern France. It is the prefecture of the Calvados department. The city proper has 108,365 inhabitants (as of 2012), while its urban area has 420,000, making Caen the largest city in former Lower Normandy.</p>
      <paper-button class="custom" raised onclick="handleClick()">CLICK ME !</paper-button>
    </div>
  </custom-gmap-infowindow>
</google-map>
```