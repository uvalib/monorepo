import _ from 'lodash';

function processProp(key, trDef, prop) {
  const type = trDef.type || trDef;
  const newKey = trDef.newName || key;
  if (!prop) {
    return {};
  } else if (type === String) {
    return { [newKey]: prop[key] };
  } else if (type === Boolean) {
    return { [newKey]: prop[key] === "0" ? false : true };
  } else if (type === Number) {
    return { [newKey]: Number(prop[key]) };
  } else {
    const tmp = {};
    tmp[key] = trDef;
    return tmp;
  }
}

export default function transformJson(items, transform) {
  return _.map(items, (item) => {
    const newProps = {};
    for (const allowedPropName in transform) {
      if (item.hasOwnProperty(allowedPropName)) {
        const proptr = transform[allowedPropName];
        const newPropName = proptr.newName || allowedPropName;
        newProps[newPropName] = [];
        for (let i = 0; i < item[allowedPropName].length; i++) {
          newProps[newPropName][i] = {};
          for (const pkey in proptr.props) {
            newProps[newPropName][i] = Object.assign(
              newProps[newPropName][i],
              processProp(pkey, proptr.props[pkey], item[allowedPropName][i])
            );
          }
        }
        if (newProps[newPropName].length === 1) {
          newProps[newPropName] = newProps[newPropName][0];
          if (proptr && proptr.props && Object.keys(proptr.props).length === 1) {
            newProps[newPropName] = _.values(newProps[newPropName])[0];
          }
        }
      } else if (!transform[allowedPropName].props) {
        newProps[allowedPropName] = transform[allowedPropName];
      }
    }
    return newProps;
  });
}
