const toDom = function (structure, options = {}) {

    if (typeof options === 'object') {
        for (let flag in options) {
            const option = options[flag];

            if (flag.toLowerCase() === 'appendto' || flag.toLowerCase() === 'at') {

                if (typeof option === 'string') {
                    const parents = document.querySelectorAll(option);
                    const newOptions = Object.assign({},options);
                    delete newOptions[flag]
                    const resp = [];
                    for (let i= 0; i < parents.length; i++) {
                        console.log(parents[i])
                        const r = toDom(structure,newOptions)
                        resp.push(r)
                        parents[i].appendChild(r);
                    }
                    return resp;
                } else if (typeof option === 'object' && (option instanceof HTMLElement)) {
                    const newOptions = Object.assign({},options);
                    delete newOptions[flag]
                    const resp = toDom(structure,newOptions)
                    option.appendChild(resp)
                    return resp;
                }
                
            } else if (flag.toLowerCase() === 'times' || flag.toLowerCase() === 't') {

                const newOptions = Object.assign({},options);
                delete newOptions[flag]
                const resp = [];
                for (let i= 0; i < option; i++) {
                    resp.push(toDom(structure,newOptions))
                }
                return resp;
            }
        }
    }

    if (Array.isArray(structure) && structure.length > 0 && typeof structure[0] === 'string') {

        // 0 => (string) tag name
        // foreach i >= 1
        //      if (object) and (not array) attributes
        //      else if (function) event listener
        //      else contained structure

        const domElement = document.createElement(structure[0])

        for (let i = 1 ; i < structure.length ; i++) {

            if (!Array.isArray(structure[i]) && typeof structure[i] === 'object') {

                for (let attrName in structure[i]) {
                    domElement.setAttribute(attrName, structure[i][attrName])
                }

            } else if (typeof structure[i] === 'function') {

                domElement.addEventListener(structure[i].name, structure[i])

            } else {

                const resp = toDom(structure[i],options)

                if (Array.isArray(resp)) {
                    resp.forEach( el => domElement.appendChild(el))
                } else {
                    domElement.appendChild(resp)
                }
            }
        }

        return domElement



    } else if (Array.isArray(structure)) {

        return structure.map(substructure => toDom(substructure,options))

    } else if (typeof structure === 'object') {

    } else if (typeof structure === 'string' || typeof structure === 'number') {

        return document.createTextNode(''+structure)
    }

    return structure
}


window.toDom = toDom;