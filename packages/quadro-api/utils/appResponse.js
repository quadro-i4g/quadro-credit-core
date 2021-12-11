// eslint-disable-next-line arrow-body-style
const formatMessage = objectOrMessage => {
  // eslint-disable-next-line no-nested-ternary
  return typeof (objectOrMessage) === 'string' ?
    objectOrMessage :
    (typeof(objectOrMessage) === 'object' && objectOrMessage?.message) ?
    objectOrMessage.message :
    '';
}

// eslint-disable-next-line arrow-body-style
const createResponse = (objectOrMessage, data, additionalData, status = false) => {
  return {
    status: status === false ? 'failure' : 'success',
    message: objectOrMessage ? formatMessage(objectOrMessage) : undefined,
    ...additionalData,
    data
  }
}


module.exports = createResponse;