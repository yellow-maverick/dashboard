import _ from 'lodash'
import { alova } from '../js/alova.js'

const sources = async () => {
  let data = await alova.Get('/v1/queries/sources/run?format=hash')
    .then( r => r.clone().json() )
    .then( d => d )
  
  data = _.keyBy(data.data, 'slug')
  return data
}

export default sources
