import consoleBridge from '../bridges/console';
import fetchBridge from '../bridges/fetch';
import { ClientType } from './client-type';

// Browser-compatible vm module using safer execution context
// IFRAME IMPLEMENTATION
(function () {
  var vm = {};
  var contextifiedSandboxes = [];

  function createIFrame() {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    return iframe;
  }

  function createIFrameWithContext(sandbox) {
    var iframe = createIFrame();
    var key;
    document.body.appendChild(iframe);
    if (sandbox) {
      for (key in sandbox) {
        if (sandbox.hasOwnProperty(key)) {
          iframe.contentWindow[key] = sandbox[key];
        }
      }
      contextifiedSandboxes.push(sandbox);
    }
    return iframe;
  }

  function runCodeInNewContext(code, sandbox) {
    var iframe = createIFrameWithContext(sandbox);
    var result = iframe.contentWindow.eval(code);
    document.body.removeChild(iframe);
    return result;
  }

  function runCodeInContext(code, context) {
    if (!context) {
      throw new Error('Context cannot be undefined');
    }
    return context.eval(code);
  }

  function Script(code) {
    this.code = code;
  }

  Script.prototype.runInContext = function (context) {
    return runCodeInContext(this.code, context);
  };

  Script.prototype.runInNewContext = function (sandbox) {
    return runCodeInNewContext(this.code, sandbox);
  };

  Script.prototype.runInThisContext = function () {
    return runCodeInContext(this.code, window);
  };

  vm.Script = Script;

  vm.createContext = function (sandbox) {
    return createIFrameWithContext(sandbox).contentWindow;
  };

  vm.isContext = function (sandbox) {
    return contextifiedSandboxes.indexOf(sandbox) !== -1;
  };

  vm.runInContext = function (code, context, sharedContextKeys) {
    return runCodeInContext(code, context, sharedContextKeys);
  };

  vm.runInDebugContext = function () {
    throw new Error('vm.runInDebugContext(code) does not work in browsers');
  };

  vm.runInNewContext = function (code, sandbox) {
    return runCodeInNewContext(code, sandbox);
  };

  vm.runInThisContext = function (code) {
    return runCodeInContext(code, window);
  };

  vm.createScript = function (code) {
    return new vm.Script(code);
  };

  window.vm = vm;
}());

// OBJECT IMPLEMENTATION - Object-based execution with variable persistence
/*(function () {
  var vm = {};
  var contextifiedSandboxes = [];

  // Create a sandboxed execution environment
  function createSafeContext(sandbox) {
    var context = Object.create(null);

          // Copy sandbox properties safely
      if (sandbox) {
        for (var key in sandbox) {
          if (Object.prototype.hasOwnProperty.call(sandbox, key)) {
            context[key] = sandbox[key];
          }
        }
        contextifiedSandboxes.push(context);
      }

    return context;
  }

  function runCodeInNewContext(code, sandbox) {
    var context = createSafeContext(sandbox);
    return runCodeInContext(code, context, sharedContextKeys);
  }

  function runCodeInContext(code, context, sharedContextKeys) {
    if (!context) {
      throw new Error('Context cannot be undefined');
    }

    // Create a proxy object that will capture variable assignments
    var executionScope = {};

    // Copy existing context variables to execution scope
    for (var key in context) {
      if (Object.prototype.hasOwnProperty.call(context, key)) {
        executionScope[key] = context[key];
      }
    }

    // Create variable declarations for existing context variables (excluding shared context keys)
    var variableDeclarations = '';
    sharedContextKeys = sharedContextKeys || [];
    for (var key in executionScope) {
      if (Object.prototype.hasOwnProperty.call(executionScope, key) && sharedContextKeys.indexOf(key) === -1) {
        variableDeclarations += 'var ' + key + ' = this.' + key + ';\n';
      }
    }

    // Transform var declarations to property assignments and collect new variable names
    var newVariables = [];
    var transformedCode = code.replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, function(match, varName) {
      newVariables.push(varName);
      return 'this.' + varName + ' =';
    });

    // Transform references to newly declared variables to use 'this.'
    for (var i = 0; i < newVariables.length; i++) {
      var varName = newVariables[i];
      // Replace variable references (but not property access like obj.varName or this.varName)
      // Use a more complex replacement function to avoid double-transforming
      var regex = new RegExp('\\b' + varName + '\\b(?!\\.)', 'g');
      transformedCode = transformedCode.replace(regex, function(match, offset, string) {
        // Don't replace if it's preceded by 'this.'
        var precedingText = string.substring(Math.max(0, offset - 5), offset);
        if (precedingText.endsWith('this.')) {
          return match; // Don't replace
        }
        return 'this.' + match;
      });
    }

    // Combine declarations and transformed code
    var finalCode = variableDeclarations + transformedCode;
    var func = new Function(finalCode);
    var result = func.call(executionScope);

    // Update context with any new variables from execution scope
    for (var key in executionScope) {
      if (Object.prototype.hasOwnProperty.call(executionScope, key)) {
        context[key] = executionScope[key];
      }
    }
    return result;
  }

  function Script(code) {
    this.code = code;
  }

  Script.prototype.runInContext = function (context) {
    return runCodeInContext(this.code, context);
  };

  Script.prototype.runInNewContext = function (sandbox) {
    return runCodeInNewContext(this.code, sandbox);
  };

  Script.prototype.runInThisContext = function () {
    return runCodeInContext(this.code, window);
  };

  vm.Script = Script;

  vm.createContext = function (sandbox) {
    return createSafeContext(sandbox);
  };

  vm.isContext = function (sandbox) {
    return contextifiedSandboxes.indexOf(sandbox) !== -1;
  };

  vm.runInContext = function (code, context, sharedContextKeys) {
    return runCodeInContext(code, context, sharedContextKeys);
  };

  vm.runInDebugContext = function () {
    throw new Error('vm.runInDebugContext(code) does not work in browsers');
  };

  vm.runInNewContext = function (code, sandbox) {
    return runCodeInNewContext(code, sandbox);
  };

  vm.runInThisContext = function (code) {
    return runCodeInContext(code, window);
  };

  vm.createScript = function (code) {
    return new vm.Script(code);
  };

  window.vm = vm;
}());*/

export default class Runner {
  async run(flows, flowsRef, onFlowStateChange) {
    // Create a shared context that persists across iterations
    const sharedContext = {
      console: consoleBridge,
      axios: fetchBridge,
    };

    // Get the keys from shared context for dynamic exclusion
    const sharedContextKeys = Object.keys(sharedContext);

    // Create a contextified object using the browser vm module
    const context = vm.createContext(sharedContext);

    for(let index = 0; index < flows.length; index++) {
      onFlowStateChange(index, true);

      const runner = {
        run: () => {
          const code = flowsRef.current?.onCompile(index, ClientType.UNIFLOW)

          const result = vm.runInContext(code || '', context, sharedContextKeys);

          return result;
        },
        getContext: () => {
          return context;
        },
      };

      await flowsRef.current?.onExecute(index, runner)
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      onFlowStateChange(index, false);
    }
  }
}
