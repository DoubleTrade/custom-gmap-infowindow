/**
 * `customg-gmap-infowindow`
 * A customizable infowindow element for google-map web component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
*/
class CustomGmapInfowindow extends Polymer.GestureEventListeners(Polymer.Element) {
  static get is() {
    return 'custom-gmap-infowindow';
  }
  static get properties() {
    return {
      /**
       * Elevation of the paper material background (0 - 5)
       */
      elevation: {
        type: Number,
        notify: true,
        value: 1,
      },

      /**
       *  Hide the marker when opening infowindow (like Airbnb does)
       */
      hideMarkerOnClick: {
        type: Boolean,
        value: false,
      },

      /**
       *  Is infowindow is open
       */
      isOpen: {
        type: Boolean,
        notify: true,
        value: false,
      },

      /**
       *  Objects dimensions, necessary for positioning the infowindow
       */
      _dim: {
        type: Object,
        notify: true,
        value: () => ({
          card: {
            height: 10,
            width: 10,
          },
          map: {
            height: 100,
            width: 100,
          },
          marker: {
            x: 0,
            y: 42,
          },
          beak: {
            width: 20,
            height: 20,
          },
        }),
      },

      /**
       *  Google map object
       */
      map: {
        type: Object,
        notify: true,
        observer: '_mapChanged',
      },

      /**
       *  Array containing map listeners for removing purpose.
       */
      _mapListeners: {
        type: Array,
        notify: true,
        value: () => [],
      },

      /**
       *  Selected google map marker object
       */
      _marker: {
        type: Object,
        notify: true,
      },

      /**
       *  Google map overlay object
       */
      _overlay: {
        type: Object,
        notify: true,
      },
    };
  }

  /**
   * Close the infowindow
   */
  close() {
    this._removeListeners();
    this.isOpen = false;
    this.$.mainContainer.style.visibility = 'hidden';
    if (this.hideMarkerOnClick) {
      this._marker.setVisible(true);
    }
  }

  /**
   * Set infowindow dimension
   */
  _setInfowindowSize() {
    const icd = this.$.mainContainer;
    this._dim.card.width = icd.offsetWidth;
    this._dim.card.height = icd.offsetHeight;
  }

  /**
   * Set the marker dimension
   */
  _setMarkerSize() {
    if (this._marker && this._marker.getIcon()) {
      const mIcon = this._marker.getIcon();
      const img = new Image();
      img.addEventListener('load', this._setCustomIconHeight.bind(this));
      img.src = mIcon;
      this._dim.marker.x = 0;
    }
  }

  _setCustomIconHeight() {
    this._dim.marker.y = event.target.naturalHeight;
  }

  /**
   * Set the map dimension
   */
  _setMapSize() {
    const gm = this.map.getDiv();
    this._dim.map.width = gm.offsetWidth;
    this._dim.map.height = gm.offsetHeight;
  }

  /**
   * Initialize map listeners
   */
  _initListeners() {
    this._mapListeners = [];

    this._overlay = new google.maps.OverlayView();
    this._overlay.draw = () => {};
    this._overlay.setMap(this.map);

    const reposition = () => {
      if (this.isOpen) {
        this._setInfowindowSize();
        this._getInfowindowPosition();
      }
    };

    this._mapListeners.push(
      google.maps.event.addListener(this.map, 'projection_changed', () => {
        this._overlay = new google.maps.OverlayView();
        this._overlay.draw = () => {};
        this._overlay.setMap(this.map);
      })
    );

    this._mapListeners.push(
      google.maps.event.addListener(this.map, 'zoom_changed', () => {
        if (this.isOpen) {
          this._setInfowindowSize();
          this._getInfowindowPosition();
        }
      })
    );

    this._mapListeners.push(
      google.maps.event.addListener(this.map, 'center_changed', () => {
        if (this.isOpen) {
          reposition();
        }
      })
    );
    this._mapListeners.push(
      google.maps.event.addListener(this._marker, 'drag', () => {
        if (this.isOpen) {
          this._getInfowindowPosition();
        }
      })
    );
  }

  /**
   * when the map is set, initialize the overlay,
   * which can take a moment since it is not loaded automatically
   * with the rest of the map apis
   */
  _mapChanged() {
    if (this.map) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = () => {};
      this._overlay.setMap(this.map);
    }
  }

  /**
   * Pan the map to move the info card into view
   * @param {Iplacement} placement current info card placement
   */
  _panToShowInfowindow(placement) {
    const panby = {
      x: 0,
      y: 0,
    };
    if (placement.left < 0) {
      panby.x = placement.left - 10;
    } else if (placement.left + this._dim.card.width > this._dim.map.width) {
      panby.x = placement.left + (this._dim.card.width - this._dim.map.width) + 10;
    }
    if (placement.top < 0) {
      panby.y = placement.top - 10;
    } else if (
      placement.top + this._dim.card.height + this._dim.marker.y + 10 >
      this._dim.map.height
    ) {
      panby.y =
        placement.top + this._dim.card.height + (this._dim.marker.y - this._dim.map.height) + 20;
    }
    if (panby.x !== 0 || panby.y !== 0) {
      this.map.panBy(panby.x, panby.y);
    }
  }

  /**
   * Determine if the infowindow fits in map bounds
   * @param  {Iplacement} current placement of the infowindow (top, left)
   * @return {boolean} true if the infowindow fits in map bounds.
   */
  _isInBounds(placement) {
    if (
      placement.top >= 0 &&
      placement.left >= 0 &&
      placement.left + this._dim.card.width < this._dim.map.width &&
      placement.top + this._dim.card.height + this._dim.marker.y + 10 < this._dim.map.height
    ) {
      return true;
    }

    return false;
  }

  ready() {
    super.ready();
    if (this.map) {
      this._overlay = new google.maps.OverlayView();
      this._overlay.draw = () => {};
      this._overlay.setMap(this.map);
    }
  }

  /**
   * Remove map listeners
   */
  _removeListeners() {
    this._mapListeners.forEach((listener) => {
      google.maps.event.removeListener(listener);
    });
    this._mapListeners = [];
  }

  /**
   * Get infowindow position
   * * @return {Iplacement} Infowindow position
   */
  _getInfowindowPosition() {
    let left = 0;
    let top = 0;
    const point = this._overlay
      .getProjection()
      .fromLatLngToContainerPixel(this._marker.getPosition());
    // calculate placement
    left = Math.round(point.x - (this._dim.card.width / 2));
    const carretHeight = parseInt(
      window
        .getComputedStyle(this.shadowRoot.querySelector('#mainContainer'), ':before')
        .getPropertyValue('border-width'),
      10
    );
    if (this.hideMarkerOnClick) {
      top = Math.round(point.y - this._dim.card.height - carretHeight);
    } else {
      top = Math.round(point.y - this._dim.card.height - this._dim.marker.y - carretHeight);
    }
    this.$.mainContainer.style.left = `${left}px`;
    this.$.mainContainer.style.top = `${top}px`;

    return { left, top };
  }

  /**
   * Shows the info card on top of the given google map marker
   * @param {google.maps.Marker} marker  The marker to attach the card to
   */
  showInfoWindow(marker) {
    if (this.map && marker) {
      if (this.isOpen) {
        this.close();
      }
      this._marker = marker;
      if (this.hideMarkerOnClick) {
        this._marker.setVisible(false);
      }
      this._setMapSize();
      this._setMarkerSize();
      this.$.mainContainer.style.visibility = 'visible';
      setTimeout(() => {
        this._setInfowindowSize();
        const placement = this._getInfowindowPosition();
        this._initListeners();
        this.isOpen = true;
        if (!this._isInBounds(placement)) {
          this._panToShowInfowindow(placement);
        }
      });
    }
  }
}

window.customElements.define(CustomGmapInfowindow.is, CustomGmapInfowindow);
