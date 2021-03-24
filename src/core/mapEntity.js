function getRecursiveValueFromProps(props, entity = {}) {
  if (!props || !entity) 
    return;

  const currProp = props.shift();
  const currEntity = entity[currProp];
  
  if(props.length === 0) {
    return currEntity;
  }
  return getRecursiveValueFromProps(props, currEntity);
}
function createObjFromProp(obj, props, value) {
  if (!props || !obj) 
    return;

  const currProp = props.shift();
  
  if(props.length === 0) {
    obj[currProp] = value;
    return;
  }
  if(!obj[currProp]) {
    obj[currProp]= {};
  }
  createObjFromProp(obj[currProp], props, value)
}

const MAX_DEEP_LEVEL = 10;

module.exports = {
  getValueFromProp(prop, entity = {}) {
    if (!prop) return;
    return getRecursiveValueFromProps(prop.split('.'), entity);
  },
  createObjFromProp(obj, prop, value) {
    createObjFromProp(obj, prop.split('.'), value)
  },
  getTranslatedObj(entity, dictionary) {
    let returnObj = {};
    for (let prop in dictionary) {
      let arrDicName = prop.split(".");
      let arrDicValue = dictionary[prop].split(".");
      let refReturnObj = returnObj;
      let refEntity = entity;
      let dicName = undefined;
      let dicValue = undefined;
      for (let i = 0; i < MAX_DEEP_LEVEL; i++) {
        if (!arrDicName[i] && !arrDicValue[i]) break;

        if (arrDicName[i]) {
          dicName = arrDicName[i];
          refEntity[dicName] && (refEntity = refEntity[dicName]);
        }
        if (arrDicValue[i]) {
          dicValue = arrDicValue[i];
          if (!refReturnObj[dicValue]) refReturnObj[dicValue] = {};
          else refReturnObj = refReturnObj[dicValue];
        }
      }
      refReturnObj[dicValue] = refEntity;
    }
    return returnObj;
  }
};
