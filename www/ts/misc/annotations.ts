
/**
 * For logging and useful metadata about various things.
 */

/**
 * Logs the name of the target method, when the method is called.
 */
export function logCalls(target: any, methodName: string, descriptor: PropertyDescriptor): any {
    
  console.log(`called ${methodName}`);
}

/**
 * Marks the method as overriding a superclass implementation.
 */
// NOTE: only catches errors in overrides of *direct* parents (and only at runtime)! could use this for better support:
// https://github.com/bet365/override-linting-rule
export function override(target: any, methodName: string, descriptor: PropertyDescriptor): any {
  
  const baseType = Object.getPrototypeOf(target);

  if(typeof baseType[methodName] !== 'function') {

      throw new Error('Method ' + methodName + ' of ' + target.constructor.name + ' does not override any direct base class method');
  }
}