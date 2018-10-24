import classnames from 'classnames'
import L from 'leaflet'
import debounce from 'lodash.debounce'
import { BasicInput } from 'pass-culture-shared'
import React, { Component, Fragment } from 'react'
import Autocomplete from 'react-autocomplete'
import { Map, Marker, TileLayer } from 'react-leaflet'

import { ROOT_PATH } from '../../utils/config'

const customIcon = new L.Icon({
  iconUrl: `${ROOT_PATH}/icons/ico-geoloc-solid2.svg`,
  iconRetinaUrl: `${ROOT_PATH}/icons/ico-geoloc-solid2.svg`,
  iconSize: [21, 30],
  iconAnchor: [10, 30],
  popupAnchor: null,
})

class GeoInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      draggable: true,
      isLoading: false,
      marker: null,
      position: props.initialPosition,
      value: '',
      suggestions: [],
    }
    this.refmarker = React.createRef()
    this.onDebouncedFetchSuggestions = debounce(
      this.fetchSuggestions,
      props.debounceTimeout
    )
  }

  static defaultProps = {
    debounceTimeout: 300,
    defaultInitialPosition: {
      // Displays France
      latitude: 46.98025235521883,
      longitude: 1.9335937500000002,
      zoom: 5,
    },
    maxSuggestions: 5,
    placeholder: "Sélectionnez l'adresse lorsqu'elle est proposée.",
    withMap: false,
    zoom: 15,
  }

  static extraFormPatch = ['latitude', 'longitude']

  static getDerivedStateFromProps = (newProps, currentState) => {
    return Object.assign(
      {},
      currentState,
      {
        position: {
          latitude:
            newProps.latitude || newProps.defaultInitialPosition.latitude,
          longitude:
            newProps.longitude || newProps.defaultInitialPosition.longitude,
          zoom:
            newProps.latitude && newProps.longitude
              ? newProps.zoom
              : newProps.defaultInitialPosition.zoom,
        },
      },
      newProps.latitude && newProps.longitude
        ? {
            suggestions: [],
            marker: {
              latitude: newProps.latitude,
              longitude: newProps.longitude,
            },
          }
        : null
    )
  }

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable })
  }

  updatePosition = () => {
    const { lat, lng } = this.refmarker.current.leafletElement.getLatLng()
    this.setState({
      marker: {
        latitude: lat,
        longitude: lng,
      },
    })
    this.props.onChange({
      latitude: lat,
      longitude: lng,
    })
  }

  onTextChange = e => {
    const { name, onChange: onFieldChange } = this.props
    const value = e.target.value
    this.setState({ value })
    this.onDebouncedFetchSuggestions(value)
    onFieldChange({
      address: null,
      city: null,
      geo: null,
      latitude: null,
      longitude: null,
      [name]: value,
      postalCode: null,
    })
  }

  onSelect = (value, item) => {
    if (item.placeholder) return
    this.setState({
      value,
      position: {
        latitude: item.latitude,
        longitude: item.longitude,
        zoom: this.props.zoom,
      },
      marker: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
    })

    this.props.onChange(item)
  }

  fetchSuggestions = value => {
    const wordsCount = value.split(/\s/).filter(v => v).length
    if (wordsCount < 2)
      return this.setState({
        suggestions: [],
      })

    this.setState({ isLoading: true })

    fetch(
      `https://api-adresse.data.gouv.fr/search/?limit=${
        this.props.maxSuggestions
      }&q=${value}`
    )
      .then(response => response.json())
      .then(data => {
        const defaultSuggestion = {
          label: this.props.placeholder,
          placeholder: true,
          id: 'placeholder',
        }

        const fetchedSuggestions = data.features.map(f => ({
          address: f.properties.name,
          city: f.properties.city,
          geo: f.geometry.coordinates,
          id: f.properties.id,
          latitude: f.geometry.coordinates[1],
          longitude: f.geometry.coordinates[0],
          label: f.properties.label,
          postalCode: f.properties.postcode,
        }))

        const suggestions = fetchedSuggestions.concat(defaultSuggestion)

        this.setState({
          isLoading: false,
          suggestions,
        })
      })
  }

  render() {
    const {
      className,
      id,
      placeholder,
      readOnly,
      required,
      size,
      withMap,
    } = this.props

    const { isLoading, marker, position, suggestions, value } = this.state

    const $input = readOnly ? (
      <BasicInput {...this.props} />
    ) : (
      <Fragment>
        <Autocomplete
          autocomplete="street-address"
          getItemValue={value => value.label}
          inputProps={{
            className: className || `input is-${size}`,
            id,
            placeholder,
            readOnly,
            required,
          }}
          items={suggestions}
          onChange={this.onTextChange}
          onSelect={this.onSelect}
          readOnly={readOnly}
          renderItem={({ id, label, placeholder }, highlighted) => (
            <div
              className={classnames({
                item: true,
                highlighted,
                placeholder,
              })}
              key={id}>
              {label}
            </div>
          )}
          renderMenu={children => (
            <div
              className={classnames('menu', { empty: children.length === 0 })}>
              {children}
            </div>
          )}
          value={this.props.value || value}
          wrapperProps={{ className: 'input-wrapper' }}
        />
        <button
          className={classnames('button is-loading', {
            'is-invisible': !isLoading,
          })}
        />
      </Fragment>
    )

    if (!withMap) return $input
    const { latitude, longitude, zoom } = position

    return (
      <div className="geo-input">
        {$input}
        <Map center={[latitude, longitude]} zoom={zoom} className="map">
          <TileLayer
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          />
          {marker && (
            <Marker
              draggable
              onDragend={this.updatePosition}
              position={[marker.latitude, marker.longitude]}
              icon={customIcon}
              ref={this.refmarker}
              alt={[marker.latitude, marker.longitude].join('-')}
            />
          )}
        </Map>
      </div>
    )
  }
}

export default GeoInput
