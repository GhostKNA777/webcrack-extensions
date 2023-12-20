var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// babel-import:@babel/generator
var generator_exports = {};
__export(generator_exports, {
  default: () => generator_default
});
__reExport(generator_exports, lib_star);
import module from "@babel/generator/lib/index.js";
import * as lib_star from "@babel/generator/lib/index.js";
var generator_default = module.default ?? module;

// src/index.ts
import { parse } from "@babel/parser";
import * as m33 from "@codemod/matchers";
import debug6 from "debug";
import { normalize as normalize2 } from "node:path";

// src/deobfuscator/index.ts
import debug3 from "debug";

// babel-import:@babel/traverse
var traverse_exports = {};
__export(traverse_exports, {
  default: () => traverse_default
});
__reExport(traverse_exports, lib_star2);
import module2 from "@babel/traverse/lib/index.js";
import * as lib_star2 from "@babel/traverse/lib/index.js";
var traverse_default = module2.default ?? module2;

// src/transforms/index.ts
import debug from "debug";
var logger = debug("webcrack:transforms");
async function applyTransformAsync(ast, transform, options) {
  logger(`${transform.name}: started`);
  const state = { changes: 0 };
  await transform.run?.(ast, state, options);
  if (transform.visitor)
    traverse_default(ast, transform.visitor(options), void 0, state);
  logger(`${transform.name}: finished with ${state.changes} changes`);
  return state;
}
function applyTransform(ast, transform, options) {
  logger(`${transform.name}: started`);
  const state = { changes: 0 };
  transform.run?.(ast, state, options);
  if (transform.visitor)
    traverse_default(ast, transform.visitor(options), void 0, state);
  logger(`${transform.name}: finished with ${state.changes} changes`);
  return state;
}
function applyTransforms(ast, transforms, name) {
  name ??= transforms.map((t25) => t25.name).join(", ");
  logger(`${name}: started`);
  const state = { changes: 0 };
  for (const transform of transforms) {
    transform.run?.(ast, state);
  }
  const traverseOptions = transforms.flatMap((t25) => t25.visitor?.() ?? []);
  if (traverseOptions.length > 0) {
    const visitor = traverse_exports.visitors.merge(traverseOptions);
    visitor.noScope = traverseOptions.every((t25) => t25.noScope);
    traverse_default(ast, visitor, void 0, state);
  }
  logger(`${name}: finished with ${state.changes} changes`);
  return state;
}

// src/transforms/mergeStrings.ts
import * as t from "@babel/types";
import * as m from "@codemod/matchers";
var mergeStrings_default = {
  name: "mergeStrings",
  tags: ["safe"],
  visitor() {
    const left = m.capture(m.stringLiteral(m.anyString()));
    const right = m.capture(m.stringLiteral(m.anyString()));
    const matcher15 = m.binaryExpression("+", left, right);
    const nestedMatcher = m.binaryExpression(
      "+",
      m.binaryExpression("+", m.anything(), left),
      right
    );
    return {
      BinaryExpression: {
        exit(path) {
          if (matcher15.match(path.node)) {
            path.replaceWith(
              t.stringLiteral(left.current.value + right.current.value)
            );
            this.changes++;
          }
        }
      },
      StringLiteral: {
        exit(path) {
          if (nestedMatcher.match(path.parent)) {
            left.current.value += right.current.value;
            path.remove();
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/deobfuscator/arrayRotator.ts
import * as m3 from "@codemod/matchers";
import { callExpression as callExpression3 } from "@codemod/matchers";

// src/utils/matcher.ts
import * as m2 from "@codemod/matchers";
function infiniteLoop(body) {
  return m2.or(
    m2.forStatement(void 0, null, void 0, body),
    m2.forStatement(void 0, truthyMatcher, void 0, body),
    m2.whileStatement(truthyMatcher, body)
  );
}
function constKey(name) {
  return m2.or(m2.identifier(name), m2.stringLiteral(name));
}
function constObjectProperty(key, value) {
  return m2.or(
    m2.objectProperty(m2.identifier(key), value, false),
    m2.objectProperty(m2.stringLiteral(key), value, true)
  );
}
function matchIife(body) {
  return m2.callExpression(
    m2.functionExpression(null, [], body ? m2.blockStatement(body) : void 0),
    []
  );
}
var iife = matchIife();
var emptyIife = matchIife([]);
function constMemberExpression(object, property) {
  if (typeof object === "string")
    object = m2.identifier(object);
  return m2.or(
    m2.memberExpression(object, m2.identifier(property), false),
    m2.memberExpression(object, m2.stringLiteral(property), true)
  );
}
var trueMatcher = m2.or(
  m2.booleanLiteral(true),
  m2.unaryExpression("!", m2.numericLiteral(0)),
  m2.unaryExpression("!", m2.unaryExpression("!", m2.numericLiteral(1))),
  m2.unaryExpression("!", m2.unaryExpression("!", m2.arrayExpression([])))
);
var falseMatcher = m2.or(
  m2.booleanLiteral(false),
  m2.unaryExpression("!", m2.arrayExpression([]))
);
var truthyMatcher = m2.or(trueMatcher, m2.arrayExpression([]));
function findParent(path, matcher15) {
  return path.findParent(
    (path2) => matcher15.match(path2.node)
  );
}
function findPath(path, matcher15) {
  return path.find((path2) => matcher15.match(path2.node));
}
function createFunctionMatcher(params, body) {
  const captures = Array.from(
    { length: params },
    () => m2.capture(m2.anyString())
  );
  return m2.functionExpression(
    void 0,
    captures.map(m2.identifier),
    m2.blockStatement(body(...captures.map((c) => m2.identifier(m2.fromCapture(c)))))
  );
}
function isReadonlyObject(binding, memberAccess) {
  if (!binding.constant && binding.constantViolations[0] !== binding.path)
    return false;
  return binding.referencePaths.every(
    (path) => (
      // obj.property
      memberAccess.match(path.parent) && // obj.property = 1
      !path.parentPath?.parentPath?.isAssignmentExpression({
        left: path.parent
      }) && // obj.property++
      !path.parentPath?.parentPath?.isUpdateExpression({
        argument: path.parent
      }) && // delete obj.property
      !path.parentPath?.parentPath?.isUnaryExpression({
        argument: path.parent,
        operator: "delete"
      }) && // [obj.property] = [{}] or ({ property: obj.property } = {})
      !path.findParent(
        (parentPath) => parentPath.isArrayPattern() || parentPath.isObjectPattern()
      )
    )
  );
}

// src/deobfuscator/arrayRotator.ts
function findArrayRotator(stringArray) {
  const arrayIdentifier = m3.capture(m3.identifier());
  const pushShift = m3.callExpression(
    constMemberExpression(arrayIdentifier, "push"),
    [
      m3.callExpression(
        constMemberExpression(m3.fromCapture(arrayIdentifier), "shift")
      )
    ]
  );
  const callMatcher = m3.callExpression(
    m3.functionExpression(
      null,
      m3.anything(),
      m3.blockStatement(
        m3.anyList(
          m3.zeroOrMore(),
          infiniteLoop(
            m3.matcher((node) => {
              return m3.containerOf(callExpression3(m3.identifier("parseInt"))).match(node) && m3.blockStatement([
                m3.tryStatement(
                  m3.containerOf(pushShift),
                  m3.containerOf(pushShift)
                )
              ]).match(node);
            })
          )
        )
      )
    )
  );
  const matcher15 = m3.expressionStatement(
    m3.or(callMatcher, m3.unaryExpression("!", callMatcher))
  );
  for (const ref of stringArray.references) {
    const rotator = findParent(ref, matcher15);
    if (rotator) {
      return rotator;
    }
  }
}

// src/deobfuscator/controlFlowObject.ts
import * as t5 from "@babel/types";
import * as m6 from "@codemod/matchers";

// src/utils/ast.ts
import * as t2 from "@babel/types";
function codePreview(node) {
  const { code } = generator_default(node, {
    minified: true,
    shouldPrintComment: () => false
  });
  if (code.length > 100) {
    return code.slice(0, 70) + " \u2026 " + code.slice(-30);
  }
  return code;
}
function getPropName(node) {
  if (t2.isIdentifier(node)) {
    return node.name;
  }
  if (t2.isStringLiteral(node)) {
    return node.value;
  }
  if (t2.isNumericLiteral(node)) {
    return node.value.toString();
  }
}

// src/utils/inline.ts
import * as t3 from "@babel/types";
import * as m4 from "@codemod/matchers";
function inlineArrayElements(array, references) {
  for (const reference of references) {
    const memberPath = reference.parentPath;
    const property = memberPath.node.property;
    const index = property.value;
    const replacement = array.elements[index];
    memberPath.replaceWith(replacement);
  }
}
function inlineCfFunction(fn, caller) {
  const returnedValue = fn.body.body[0].argument;
  const clone = t3.cloneNode(returnedValue, true);
  traverse_default(clone, {
    Identifier(path) {
      const paramIndex = fn.params.findIndex(
        (p) => p.name === path.node.name
      );
      if (paramIndex !== -1) {
        path.replaceWith(caller.node.arguments[paramIndex]);
        path.skip();
      }
    },
    noScope: true
  });
  caller.replaceWith(clone);
}
function inlineFunctionAliases(binding) {
  const state = { changes: 0 };
  const refs = [...binding.referencePaths];
  for (const ref of refs) {
    const fn = findParent(ref, m4.functionDeclaration());
    const fnName = m4.capture(m4.anyString());
    const returnedCall = m4.capture(
      m4.callExpression(
        m4.identifier(binding.identifier.name),
        m4.anyList(m4.slice({ min: 2 }))
      )
    );
    const matcher15 = m4.functionDeclaration(
      m4.identifier(fnName),
      m4.anyList(m4.slice({ min: 2 })),
      m4.blockStatement([m4.returnStatement(returnedCall)])
    );
    if (fn && matcher15.match(fn.node)) {
      const paramUsedInDecodeCall = fn.node.params.some((param) => {
        const binding2 = fn.scope.getBinding(param.name);
        return binding2?.referencePaths.some(
          (ref2) => ref2.findParent((p) => p.node === returnedCall.current)
        );
      });
      if (!paramUsedInDecodeCall)
        continue;
      const fnBinding = fn.scope.parent.getBinding(fnName.current);
      if (!fnBinding)
        continue;
      const fnRefs = fnBinding.referencePaths;
      refs.push(...fnRefs);
      const callRefs = fnRefs.filter(
        (ref2) => t3.isCallExpression(ref2.parent) && t3.isIdentifier(ref2.parent.callee, { name: fnName.current })
      ).map((ref2) => ref2.parentPath);
      for (const callRef of callRefs) {
        const fnClone = t3.cloneNode(fn.node, true);
        traverse_default(fnClone.body, {
          Identifier(path) {
            const paramIndex = fnClone.params.findIndex(
              (p) => p.name === path.node.name
            );
            if (paramIndex !== -1) {
              path.replaceWith(callRef.node.arguments[paramIndex]);
              path.skip();
            }
          },
          noScope: true
        });
        callRef.replaceWith(
          fnClone.body.body[0].argument
        );
        state.changes++;
      }
      fn.remove();
      state.changes++;
    }
  }
  binding.scope.crawl();
  return state;
}
function inlineVariableAliases(binding, targetName = binding.identifier.name) {
  const state = { changes: 0 };
  const refs = [...binding.referencePaths];
  const varName = m4.capture(m4.anyString());
  const matcher15 = m4.or(
    m4.variableDeclarator(
      m4.identifier(varName),
      m4.identifier(binding.identifier.name)
    ),
    m4.assignmentExpression(
      "=",
      m4.identifier(varName),
      m4.identifier(binding.identifier.name)
    )
  );
  for (const ref of refs) {
    if (matcher15.match(ref.parent)) {
      const varScope = ref.scope;
      const varBinding = varScope.getBinding(varName.current);
      if (!varBinding)
        continue;
      state.changes += inlineVariableAliases(varBinding, targetName).changes;
      if (ref.parentPath?.isAssignmentExpression()) {
        varBinding.path.remove();
        if (t3.isExpressionStatement(ref.parentPath.parent)) {
          ref.parentPath.remove();
        } else {
          ref.parentPath.replaceWith(ref.parentPath.node.right);
        }
      } else if (ref.parentPath?.isVariableDeclarator()) {
        ref.parentPath.remove();
      }
      state.changes++;
    } else {
      ref.replaceWith(t3.identifier(targetName));
      state.changes++;
    }
  }
  return state;
}

// src/utils/rename.ts
import * as t4 from "@babel/types";
import * as m5 from "@codemod/matchers";
import assert from "assert";
function renameFast(binding, newName) {
  binding.referencePaths.forEach((ref) => {
    assert(
      ref.isIdentifier(),
      `Unexpected reference (${ref.type}): ${codePreview(ref.node)}`
    );
    if (ref.scope.hasBinding(newName))
      ref.scope.rename(newName);
    ref.node.name = newName;
  });
  const patternMatcher = m5.assignmentExpression(
    "=",
    m5.or(m5.arrayPattern(), m5.objectPattern())
  );
  binding.constantViolations.forEach((ref) => {
    if (ref.scope.hasBinding(newName))
      ref.scope.rename(newName);
    if (ref.isAssignmentExpression() && t4.isIdentifier(ref.node.left)) {
      ref.node.left.name = newName;
    } else if (ref.isUpdateExpression() && t4.isIdentifier(ref.node.argument)) {
      ref.node.argument.name = newName;
    } else if (ref.isVariableDeclarator() && t4.isIdentifier(ref.node.id)) {
      ref.node.id.name = newName;
    } else if (ref.isFor() || patternMatcher.match(ref.node)) {
      traverse_default(ref.node, {
        Identifier(path) {
          if (path.scope !== ref.scope)
            return path.skip();
          if (path.node.name === binding.identifier.name) {
            path.node.name = newName;
          }
        },
        noScope: true
      });
    } else {
      throw new Error(
        `Unexpected constant violation (${ref.type}): ${codePreview(ref.node)}`
      );
    }
  });
  binding.scope.removeOwnBinding(binding.identifier.name);
  binding.scope.bindings[newName] = binding;
  binding.identifier.name = newName;
}
function renameParameters(path, newNames) {
  const params = path.node.params;
  for (let i = 0; i < Math.min(params.length, newNames.length); i++) {
    const binding = path.scope.getBinding(params[i].name);
    renameFast(binding, newNames[i]);
  }
}

// src/deobfuscator/controlFlowObject.ts
var controlFlowObject_default = {
  name: "controlFlowObject",
  tags: ["safe"],
  visitor() {
    const varId = m6.capture(m6.identifier());
    const propertyName = m6.matcher((name) => /^[a-z]{5}$/i.test(name));
    const propertyKey = constKey(propertyName);
    const property = m6.or(
      // E.g. "6|0|4|3|1|5|2"
      m6.stringLiteral(),
      // E.g. function (a, b) { return a + b }
      createFunctionMatcher(2, (left, right) => [
        m6.returnStatement(
          m6.or(
            m6.binaryExpression(void 0, left, right),
            m6.logicalExpression(void 0, left, right)
          )
        )
      ]),
      // E.g. function (a, b, c) { return a(b, c) } with an arbitrary number of arguments
      m6.matcher((node) => {
        return t5.isFunctionExpression(node) && createFunctionMatcher(node.params.length, (...params) => [
          m6.returnStatement(m6.callExpression(params[0], params.slice(1)))
        ]).match(node);
      })
    );
    const objectProperties = m6.capture(
      m6.arrayOf(m6.objectProperty(propertyKey, property))
    );
    const aliasId = m6.capture(m6.identifier());
    const aliasVar = m6.variableDeclarator(aliasId, m6.fromCapture(varId));
    const assignedKey = m6.capture(propertyName);
    const assignedValue = m6.capture(property);
    const assignment = m6.expressionStatement(
      m6.assignmentExpression(
        "=",
        constMemberExpression(m6.fromCapture(varId), assignedKey),
        assignedValue
      )
    );
    const memberAccess = constMemberExpression(
      m6.or(m6.fromCapture(varId), m6.fromCapture(aliasId)),
      propertyName
    );
    const varMatcher = m6.variableDeclarator(
      varId,
      m6.capture(m6.objectExpression(objectProperties))
    );
    function isConstantBinding(binding) {
      return binding.constant || binding.constantViolations[0] === binding.path;
    }
    function transform(path) {
      let changes = 0;
      if (varMatcher.match(path.node)) {
        const binding = path.scope.getBinding(varId.current.name);
        if (!binding)
          return changes;
        if (!isConstantBinding(binding))
          return changes;
        if (objectProperties.current.length === 0)
          transformObjectKeys(binding);
        if (!isReadonlyObject(binding, memberAccess))
          return changes;
        const props = new Map(
          objectProperties.current.map((p) => [
            getPropName(p.key),
            p.value
          ])
        );
        if (!props.size)
          return changes;
        const oldRefs = [...binding.referencePaths];
        [...binding.referencePaths].reverse().forEach((ref) => {
          const memberPath = ref.parentPath;
          const propName = getPropName(memberPath.node.property);
          const value = props.get(propName);
          if (t5.isStringLiteral(value)) {
            memberPath.replaceWith(value);
          } else {
            inlineCfFunction(
              value,
              memberPath.parentPath
            );
          }
          changes++;
        });
        oldRefs.forEach((ref) => {
          const varDeclarator = findParent(ref, m6.variableDeclarator());
          if (varDeclarator)
            changes += transform(varDeclarator);
        });
        path.remove();
        changes++;
      }
      return changes;
    }
    function transformObjectKeys(objBinding) {
      const refs = objBinding.referencePaths;
      if (refs.length < 2)
        return;
      if (!aliasVar.match(refs.at(-1)?.parent))
        return;
      const assignments = [];
      for (let i = 0; i < refs.length - 1; i++) {
        const expressionStatement12 = refs[i].parentPath?.parentPath?.parentPath;
        traverse_default(expressionStatement12.node, mergeStrings_default.visitor(), void 0, {
          changes: 0
        });
        if (!assignment.match(expressionStatement12?.node))
          return;
        assignments.push(expressionStatement12);
        objectProperties.current.push(
          t5.objectProperty(
            t5.identifier(assignedKey.current),
            assignedValue.current
          )
        );
      }
      const aliasBinding = objBinding.scope.getBinding(aliasId.current.name);
      if (!isReadonlyObject(aliasBinding, memberAccess))
        return;
      objBinding.referencePaths = aliasBinding.referencePaths;
      objBinding.references = aliasBinding.references;
      renameFast(aliasBinding, objBinding.identifier.name);
      assignments.forEach((p) => p.remove());
      aliasBinding.path.remove();
    }
    return {
      VariableDeclarator: {
        exit(path) {
          this.changes += transform(path);
        }
      },
      noScope: true
    };
  }
};

// src/deobfuscator/controlFlowSwitch.ts
import * as t6 from "@babel/types";
import * as m7 from "@codemod/matchers";
var controlFlowSwitch_default = {
  name: "controlFlowSwitch",
  tags: ["safe"],
  visitor() {
    const sequenceName = m7.capture(m7.identifier());
    const sequenceString = m7.capture(
      m7.matcher((s) => /^\d+(\|\d+)*$/.test(s))
    );
    const iterator = m7.capture(m7.identifier());
    const cases = m7.capture(
      m7.arrayOf(
        m7.switchCase(
          m7.stringLiteral(m7.matcher((s) => /^\d+$/.test(s))),
          m7.anyList(
            m7.zeroOrMore(),
            m7.or(m7.continueStatement(), m7.returnStatement())
          )
        )
      )
    );
    const matcher15 = m7.blockStatement(
      m7.anyList(
        // E.g. const sequence = "2|4|3|0|1".split("|")
        m7.variableDeclaration(void 0, [
          m7.variableDeclarator(
            sequenceName,
            m7.callExpression(
              constMemberExpression(m7.stringLiteral(sequenceString), "split"),
              [m7.stringLiteral("|")]
            )
          )
        ]),
        // E.g. let iterator = 0 or -0x1a70 + 0x93d + 0x275 * 0x7
        m7.variableDeclaration(void 0, [m7.variableDeclarator(iterator)]),
        infiniteLoop(
          m7.blockStatement([
            m7.switchStatement(
              // E.g. switch (sequence[iterator++]) {
              m7.memberExpression(
                m7.fromCapture(sequenceName),
                m7.updateExpression("++", m7.fromCapture(iterator)),
                true
              ),
              cases
            ),
            m7.breakStatement()
          ])
        ),
        m7.zeroOrMore()
      )
    );
    return {
      BlockStatement: {
        exit(path) {
          if (!matcher15.match(path.node))
            return;
          const caseStatements = new Map(
            cases.current.map((c) => [
              c.test.value,
              t6.isContinueStatement(c.consequent.at(-1)) ? c.consequent.slice(0, -1) : c.consequent
            ])
          );
          const sequence = sequenceString.current.split("|");
          const newStatements = sequence.flatMap((s) => caseStatements.get(s));
          path.node.body.splice(0, 3, ...newStatements);
          this.changes += newStatements.length + 3;
        }
      },
      noScope: true
    };
  }
};

// src/deobfuscator/deadCode.ts
import * as t7 from "@babel/types";
import * as m8 from "@codemod/matchers";
var deadCode_default = {
  name: "deadCode",
  tags: ["unsafe"],
  visitor() {
    const stringComparison = m8.binaryExpression(
      m8.or("===", "==", "!==", "!="),
      m8.stringLiteral(),
      m8.stringLiteral()
    );
    const testMatcher = m8.or(
      stringComparison,
      m8.unaryExpression("!", stringComparison)
    );
    return {
      "IfStatement|ConditionalExpression": {
        exit(_path) {
          const path = _path;
          if (!testMatcher.match(path.node.test))
            return;
          const { scope } = path;
          function renameShadowedVariables(localScope) {
            if (localScope === scope)
              return;
            for (const name in localScope.bindings) {
              if (scope.hasBinding(name)) {
                renameFast(localScope.bindings[name], scope.generateUid(name));
              }
            }
          }
          if (path.get("test").evaluateTruthy()) {
            renameShadowedVariables(path.get("consequent").scope);
            replace(path, path.node.consequent);
          } else if (path.node.alternate) {
            renameShadowedVariables(path.get("alternate").scope);
            replace(path, path.node.alternate);
          } else {
            path.remove();
          }
          this.changes++;
        }
      },
      noScope: true
    };
  }
};
function replace(path, node) {
  if (t7.isBlockStatement(node)) {
    path.replaceWithMultiple(node.body);
  } else {
    path.replaceWith(node);
  }
}

// src/deobfuscator/decoder.ts
import { expression } from "@babel/template";
import * as m9 from "@codemod/matchers";
var Decoder = class {
  name;
  path;
  constructor(name, path) {
    this.name = name;
    this.path = path;
  }
  collectCalls() {
    const calls = [];
    const argumentMatcher = m9.or(
      m9.binaryExpression(
        m9.anything(),
        m9.matcher((node) => argumentMatcher.match(node)),
        m9.matcher((node) => argumentMatcher.match(node))
      ),
      m9.unaryExpression(
        "-",
        m9.matcher((node) => argumentMatcher.match(node))
      ),
      m9.numericLiteral(),
      m9.stringLiteral()
    );
    const call = m9.callExpression(
      m9.identifier(this.name),
      m9.arrayOf(argumentMatcher)
    );
    const conditional = m9.capture(m9.conditionalExpression());
    const conditionalCall = m9.callExpression(m9.identifier(this.name), [
      conditional
    ]);
    const buildExtractedConditional = expression`TEST ? CALLEE(CONSEQUENT) : CALLEE(ALTERNATE)`;
    const binding = this.path.scope.getBinding(this.name);
    for (const ref of binding.referencePaths) {
      if (conditionalCall.match(ref.parent)) {
        const [replacement] = ref.parentPath.replaceWith(
          buildExtractedConditional({
            TEST: conditional.current.test,
            CALLEE: ref.parent.callee,
            CONSEQUENT: conditional.current.consequent,
            ALTERNATE: conditional.current.alternate
          })
        );
        replacement.scope.crawl();
      } else if (call.match(ref.parent)) {
        calls.push(ref.parentPath);
      }
    }
    return calls;
  }
};
function findDecoders(stringArray) {
  const decoders = [];
  const functionName = m9.capture(m9.anyString());
  const arrayIdentifier = m9.capture(m9.identifier());
  const matcher15 = m9.functionDeclaration(
    m9.identifier(functionName),
    m9.anything(),
    m9.blockStatement(
      m9.anyList(
        // var array = getStringArray();
        m9.variableDeclaration(void 0, [
          m9.variableDeclarator(
            arrayIdentifier,
            m9.callExpression(m9.identifier(stringArray.name))
          )
        ]),
        m9.zeroOrMore(),
        // var h = array[e]; return h;
        // or return array[e -= 254];
        m9.containerOf(
          m9.memberExpression(m9.fromCapture(arrayIdentifier), void 0, true)
        ),
        m9.zeroOrMore()
      )
    )
  );
  for (const ref of stringArray.references) {
    const decoderFn = findParent(ref, matcher15);
    if (decoderFn) {
      const oldName = functionName.current;
      const newName = `__DECODE_${decoders.length}__`;
      const binding = decoderFn.scope.getBinding(oldName);
      renameFast(binding, newName);
      decoders.push(new Decoder(newName, decoderFn));
    }
  }
  return decoders;
}

// src/deobfuscator/inlineDecodedStrings.ts
import * as t8 from "@babel/types";
var inlineDecodedStrings_default = {
  name: "inlineDecodedStrings",
  tags: ["unsafe"],
  async run(ast, state, options) {
    if (!options)
      return;
    const calls = options.vm.decoders.flatMap(
      (decoder) => decoder.collectCalls()
    );
    const decodedValues = await options.vm.decode(calls);
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const value = decodedValues[i];
      call.replaceWith(t8.valueToNode(value));
      if (typeof value !== "string")
        call.addComment("leading", "webcrack:decode_error");
    }
    state.changes += calls.length;
  }
};

// src/deobfuscator/inlineDecoderWrappers.ts
var inlineDecoderWrappers_default = {
  name: "inlineDecoderWrappers",
  tags: ["unsafe"],
  run(ast, state, decoder) {
    if (!decoder?.node.id)
      return;
    const decoderName = decoder.node.id.name;
    const decoderBinding = decoder.parentPath.scope.getBinding(decoderName);
    if (decoderBinding) {
      state.changes += inlineVariableAliases(decoderBinding).changes;
      state.changes += inlineFunctionAliases(decoderBinding).changes;
    }
  }
};

// src/deobfuscator/inlineObjectProps.ts
import * as m10 from "@codemod/matchers";
var inlineObjectProps_default = {
  name: "inlineObjectProps",
  tags: ["safe"],
  visitor() {
    const varId = m10.capture(m10.identifier());
    const propertyName = m10.matcher((name) => /^[\w]+$/i.test(name));
    const propertyKey = constKey(propertyName);
    const objectProperties = m10.capture(
      m10.arrayOf(
        m10.objectProperty(
          propertyKey,
          m10.or(m10.stringLiteral(), m10.numericLiteral())
        )
      )
    );
    const memberAccess = constMemberExpression(
      m10.fromCapture(varId),
      propertyName
    );
    const varMatcher = m10.variableDeclarator(
      varId,
      m10.objectExpression(objectProperties)
    );
    return {
      VariableDeclarator(path) {
        if (!varMatcher.match(path.node))
          return;
        if (objectProperties.current.length === 0)
          return;
        const binding = path.scope.getBinding(varId.current.name);
        if (!binding || !isReadonlyObject(binding, memberAccess))
          return;
        const props = new Map(
          objectProperties.current.map((p) => [
            getPropName(p.key),
            p.value
          ])
        );
        if (!binding.referencePaths.every((ref) => {
          const memberPath = ref.parentPath;
          const propName = getPropName(memberPath.node.property);
          return props.has(propName);
        }))
          return;
        binding.referencePaths.forEach((ref) => {
          const memberPath = ref.parentPath;
          const propName = getPropName(memberPath.node.property);
          const value = props.get(propName);
          memberPath.replaceWith(value);
          this.changes++;
        });
        path.remove();
        this.changes++;
      },
      noScope: true
    };
  }
};

// src/deobfuscator/stringArray.ts
import * as m11 from "@codemod/matchers";
function findStringArray(ast) {
  let result;
  const functionName = m11.capture(m11.anyString());
  const arrayIdentifier = m11.capture(m11.identifier());
  const arrayExpression7 = m11.capture(
    m11.arrayExpression(m11.arrayOf(m11.stringLiteral()))
  );
  const functionAssignment = m11.assignmentExpression(
    "=",
    m11.identifier(m11.fromCapture(functionName)),
    m11.functionExpression(
      void 0,
      [],
      m11.blockStatement([m11.returnStatement(m11.fromCapture(arrayIdentifier))])
    )
  );
  const variableDeclaration10 = m11.variableDeclaration(void 0, [
    m11.variableDeclarator(arrayIdentifier, arrayExpression7)
  ]);
  const matcher15 = m11.functionDeclaration(
    m11.identifier(functionName),
    [],
    m11.or(
      // var array = ["hello", "world"];
      // return (getStringArray = function () { return array; })();
      m11.blockStatement([
        variableDeclaration10,
        m11.returnStatement(m11.callExpression(functionAssignment))
      ]),
      // var array = ["hello", "world"];
      // getStringArray = function () { return n; });
      // return getStringArray();
      m11.blockStatement([
        variableDeclaration10,
        m11.expressionStatement(functionAssignment),
        m11.returnStatement(m11.callExpression(m11.identifier(functionName)))
      ])
    )
  );
  traverse_default(ast, {
    // Wrapped string array from later javascript-obfuscator versions
    FunctionDeclaration(path) {
      if (matcher15.match(path.node)) {
        const length = arrayExpression7.current.elements.length;
        const name = functionName.current;
        const binding = path.scope.getBinding(name);
        renameFast(binding, "__STRING_ARRAY__");
        result = {
          path,
          references: binding.referencePaths,
          name: "__STRING_ARRAY__",
          length
        };
        path.stop();
      }
    },
    // Simple string array inlining (only `array[0]`, `array[1]` etc references, no rotating/decoding).
    // May be used by older or different obfuscators
    VariableDeclaration(path) {
      if (!variableDeclaration10.match(path.node))
        return;
      const length = arrayExpression7.current.elements.length;
      const binding = path.scope.getBinding(arrayIdentifier.current.name);
      const memberAccess = m11.memberExpression(
        m11.fromCapture(arrayIdentifier),
        m11.numericLiteral(m11.matcher((value) => value < length))
      );
      if (!isReadonlyObject(binding, memberAccess))
        return;
      inlineArrayElements(arrayExpression7.current, binding.referencePaths);
      path.remove();
    }
  });
  return result;
}

// src/deobfuscator/vm.ts
import debug2 from "debug";
function createBrowserSandbox() {
  return () => {
    throw new Error("Custom Sandbox implementation required.");
  };
}
var VMDecoder = class {
  decoders;
  setupCode;
  sandbox;
  constructor(sandbox, stringArray, decoders, rotator) {
    this.sandbox = sandbox;
    this.decoders = decoders;
    const generateOptions = {
      compact: true,
      shouldPrintComment: () => false
    };
    const stringArrayCode = generator_default(
      stringArray.path.node,
      generateOptions
    ).code;
    const rotatorCode = rotator ? generator_default(rotator.node, generateOptions).code : "";
    const decoderCode = decoders.map((decoder) => generator_default(decoder.path.node, generateOptions).code).join(";\n");
    this.setupCode = [stringArrayCode, rotatorCode, decoderCode].join(";\n");
  }
  async decode(calls) {
    const code = `(() => {
      ${this.setupCode}
      return [${calls.join(",")}]
    })()`;
    try {
      const result = await this.sandbox(code);
      return result;
    } catch (err) {
      debug2("webcrack:deobfuscate")("vm code:", code);
      throw err;
    }
  }
};

// src/deobfuscator/index.ts
var deobfuscator_default = {
  name: "deobfuscate",
  tags: ["unsafe"],
  async run(ast, state, sandbox) {
    const logger3 = debug3("webcrack:deobfuscate");
    if (!sandbox)
      return;
    const stringArray = findStringArray(ast);
    logger3(
      stringArray ? `String Array: ${stringArray.length} strings` : "String Array: no"
    );
    if (!stringArray)
      return;
    const rotator = findArrayRotator(stringArray);
    logger3(`String Array Rotate: ${rotator ? "yes" : "no"}`);
    const decoders = findDecoders(stringArray);
    logger3(`String Array Encodings: ${decoders.length}`);
    state.changes += applyTransform(ast, inlineObjectProps_default).changes;
    for (const decoder of decoders) {
      state.changes += applyTransform(
        ast,
        inlineDecoderWrappers_default,
        decoder.path
      ).changes;
    }
    const vm = new VMDecoder(sandbox, stringArray, decoders, rotator);
    state.changes += (await applyTransformAsync(ast, inlineDecodedStrings_default, { vm })).changes;
    stringArray.path.remove();
    rotator?.remove();
    decoders.forEach((decoder) => decoder.path.remove());
    state.changes += 2 + decoders.length;
    state.changes += applyTransforms(
      ast,
      [mergeStrings_default, deadCode_default, controlFlowObject_default, controlFlowSwitch_default],
      "mergeStrings, deadCode, controlFlow"
    ).changes;
  }
};

// src/deobfuscator/debugProtection.ts
import * as m12 from "@codemod/matchers";
import { ifStatement as ifStatement2 } from "@codemod/matchers";
var debugProtection_default = {
  name: "debugProtection",
  tags: ["safe"],
  visitor() {
    const ret = m12.capture(m12.identifier());
    const debugProtectionFunctionName = m12.capture(m12.anyString());
    const debuggerProtection = m12.capture(m12.identifier());
    const counter = m12.capture(m12.identifier());
    const debuggerTemplate = m12.ifStatement(
      void 0,
      void 0,
      m12.containerOf(
        m12.or(
          m12.debuggerStatement(),
          m12.callExpression(
            constMemberExpression(m12.anyExpression(), "constructor"),
            [m12.stringLiteral("debugger")]
          )
        )
      )
    );
    const intervalCall = m12.callExpression(
      constMemberExpression(m12.anyExpression(), "setInterval"),
      [
        m12.identifier(m12.fromCapture(debugProtectionFunctionName)),
        m12.numericLiteral()
      ]
    );
    const matcher15 = m12.functionDeclaration(
      m12.identifier(debugProtectionFunctionName),
      [ret],
      m12.blockStatement([
        // function debuggerProtection (counter) {
        m12.functionDeclaration(
          debuggerProtection,
          [counter],
          m12.blockStatement([
            debuggerTemplate,
            // debuggerProtection(++counter);
            m12.expressionStatement(
              m12.callExpression(m12.fromCapture(debuggerProtection), [
                m12.updateExpression("++", m12.fromCapture(counter), true)
              ])
            )
          ])
        ),
        m12.tryStatement(
          m12.blockStatement([
            // if (ret) {
            ifStatement2(
              m12.fromCapture(ret),
              // return debuggerProtection;
              m12.blockStatement([
                m12.returnStatement(m12.fromCapture(debuggerProtection))
              ]),
              // } else { debuggerProtection(0); }
              m12.blockStatement([
                m12.expressionStatement(
                  m12.callExpression(m12.fromCapture(debuggerProtection), [
                    m12.numericLiteral(0)
                  ])
                )
              ])
            )
          ])
        )
      ])
    );
    return {
      FunctionDeclaration(path) {
        if (!matcher15.match(path.node))
          return;
        const binding = path.scope.getBinding(
          debugProtectionFunctionName.current
        );
        binding.referencePaths.forEach((ref) => {
          if (intervalCall.match(ref.parent)) {
            findParent(ref, iife)?.remove();
          }
        });
        path.remove();
      },
      noScope: true
    };
  }
};

// src/deobfuscator/mergeObjectAssignments.ts
import * as t9 from "@babel/types";
import * as m13 from "@codemod/matchers";
var mergeObjectAssignments_default = {
  name: "mergeObjectAssignments",
  tags: ["safe"],
  visitor: () => {
    const id = m13.capture(m13.identifier());
    const object = m13.capture(m13.objectExpression([]));
    const varMatcher = m13.variableDeclaration(void 0, [
      m13.variableDeclarator(id, object)
    ]);
    const key = m13.capture(m13.anyExpression());
    const computed = m13.capture(m13.anything());
    const value = m13.capture(m13.anyExpression());
    const assignmentMatcher = m13.expressionStatement(
      m13.assignmentExpression(
        "=",
        m13.memberExpression(m13.fromCapture(id), key, computed),
        value
      )
    );
    return {
      Program(path) {
        path.scope.crawl();
      },
      VariableDeclaration: {
        exit(path) {
          if (!path.inList || !varMatcher.match(path.node))
            return;
          const binding = path.scope.getBinding(id.current.name);
          const container = path.container;
          const siblingIndex = path.key + 1;
          while (siblingIndex < container.length) {
            const sibling = path.getSibling(siblingIndex);
            if (!assignmentMatcher.match(sibling.node) || hasCircularReference(value.current, binding))
              return;
            const isComputed = computed.current && key.current.type !== "NumericLiteral" && key.current.type !== "StringLiteral";
            object.current.properties.push(
              t9.objectProperty(key.current, value.current, isComputed)
            );
            sibling.remove();
            binding.dereference();
            binding.referencePaths.shift();
            if (binding.references === 1 && inlineableObject.match(object.current)) {
              binding.referencePaths[0].replaceWith(object.current);
              path.remove();
              this.changes++;
            }
          }
        }
      }
    };
  }
};
function hasCircularReference(node, binding) {
  return (
    // obj.foo = obj;
    binding.referencePaths.some((path) => path.find((p) => p.node === node)) || // obj.foo = fn(); where fn could reference the binding or not, for simplicity we assume it does.
    m13.containerOf(m13.callExpression()).match(node)
  );
}
var inlineableObject = m13.matcher(
  (node) => t9.isLiteral(node) && !t9.isTemplateLiteral(node) || m13.arrayExpression(m13.arrayOf(inlineableObject)).match(node) || m13.objectExpression(
    m13.arrayOf(constObjectProperty(m13.anything(), inlineableObject))
  ).match(node)
);

// src/deobfuscator/selfDefending.ts
import * as m14 from "@codemod/matchers";
var selfDefending_default = {
  name: "selfDefending",
  tags: ["safe"],
  visitor() {
    const callController = m14.capture(m14.anyString());
    const firstCall = m14.capture(m14.identifier());
    const rfn = m14.capture(m14.identifier());
    const context = m14.capture(m14.identifier());
    const res = m14.capture(m14.identifier());
    const fn = m14.capture(m14.identifier());
    const matcher15 = m14.variableDeclarator(
      m14.identifier(callController),
      matchIife([
        // let firstCall = true;
        m14.variableDeclaration(void 0, [
          m14.variableDeclarator(firstCall, trueMatcher)
        ]),
        // return function (context, fn) {
        m14.returnStatement(
          m14.functionExpression(
            null,
            [context, fn],
            m14.blockStatement([
              m14.variableDeclaration(void 0, [
                // const rfn = firstCall ? function() {
                m14.variableDeclarator(
                  rfn,
                  m14.conditionalExpression(
                    m14.fromCapture(firstCall),
                    m14.functionExpression(
                      null,
                      [],
                      m14.blockStatement([
                        // if (fn) {
                        m14.ifStatement(
                          m14.fromCapture(fn),
                          m14.blockStatement([
                            // const res = fn.apply(context, arguments);
                            m14.variableDeclaration(void 0, [
                              m14.variableDeclarator(
                                res,
                                m14.callExpression(
                                  constMemberExpression(
                                    m14.fromCapture(fn),
                                    "apply"
                                  ),
                                  [
                                    m14.fromCapture(context),
                                    m14.identifier("arguments")
                                  ]
                                )
                              )
                            ]),
                            // fn = null;
                            m14.expressionStatement(
                              m14.assignmentExpression(
                                "=",
                                m14.fromCapture(fn),
                                m14.nullLiteral()
                              )
                            ),
                            // return res;
                            m14.returnStatement(m14.fromCapture(res))
                          ])
                        )
                      ])
                    ),
                    // : function() {}
                    m14.functionExpression(null, [], m14.blockStatement([]))
                  )
                )
              ]),
              // firstCall = false;
              m14.expressionStatement(
                m14.assignmentExpression(
                  "=",
                  m14.fromCapture(firstCall),
                  falseMatcher
                )
              ),
              // return rfn;
              m14.returnStatement(m14.fromCapture(rfn))
            ])
          )
        )
      ])
    );
    return {
      VariableDeclarator(path) {
        if (!matcher15.match(path.node))
          return;
        const binding = path.scope.getBinding(callController.current);
        binding.referencePaths.filter((ref) => ref.parent.type === "CallExpression").forEach((ref) => {
          if (ref.parentPath?.parent.type === "CallExpression") {
            ref.parentPath.parentPath?.remove();
          } else {
            removeSelfDefendingRefs(ref);
          }
          findParent(ref, emptyIife)?.remove();
          this.changes++;
        });
        path.remove();
        this.changes++;
      },
      noScope: true
    };
  }
};
function removeSelfDefendingRefs(path) {
  const varName = m14.capture(m14.anyString());
  const varMatcher = m14.variableDeclarator(
    m14.identifier(varName),
    m14.callExpression(m14.identifier(path.node.name))
  );
  const callMatcher = m14.expressionStatement(
    m14.callExpression(m14.identifier(m14.fromCapture(varName)), [])
  );
  const varDecl = findParent(path, varMatcher);
  if (varDecl) {
    const binding = varDecl.scope.getBinding(varName.current);
    binding?.referencePaths.forEach((ref) => {
      if (callMatcher.match(ref.parentPath?.parent))
        ref.parentPath?.parentPath?.remove();
    });
    varDecl.remove();
  }
}

// src/extractor/index.ts
import debug5 from "debug";

// src/extractor/browserify/index.ts
import * as t10 from "@babel/types";
import * as m15 from "@codemod/matchers";

// src/utils/path.ts
import assert2 from "node:assert";
import { dirname, join, relative } from "node:path/posix";
function relativePath(from, to) {
  if (to.startsWith("node_modules/"))
    return to.replace("node_modules/", "");
  const relativePath2 = relative(dirname(from), to);
  return relativePath2.startsWith(".") ? relativePath2 : "./" + relativePath2;
}
function resolveDependencyTree(tree, entry) {
  const paths = resolveTreePaths(tree, entry);
  paths[entry] = "./index.js";
  const entryDepth = Object.values(paths).reduce(
    (acc, path) => Math.max(acc, path.split("..").length),
    0
  );
  const prefix = Array(entryDepth - 1).fill(0).map((_, i) => `tmp${i}`).join("/");
  return Object.fromEntries(
    Object.entries(paths).map(([id, path]) => {
      const newPath = path.startsWith("node_modules/") ? path : join(prefix, path);
      assert2(!newPath.includes(".."));
      assert2(!newPath.startsWith("/"));
      return [id, newPath];
    })
  );
}
function resolveTreePaths(graph, entry, cwd = ".", paths = {}) {
  const entries = Object.entries(graph[entry]);
  for (const [id, name] of entries) {
    const isCircular = Object.hasOwn(paths, id);
    if (isCircular)
      continue;
    let path;
    if (name.startsWith(".")) {
      path = join(cwd, name);
      if (!path.endsWith(".js"))
        path += ".js";
    } else {
      path = join("node_modules", name, "index.js");
    }
    paths[id] = path;
    const newCwd = path.endsWith(".js") ? dirname(path) : path;
    resolveTreePaths(graph, id, newCwd, paths);
  }
  return paths;
}

// src/extractor/bundle.ts
import debug4 from "debug";
import "node:path/posix";
var logger2 = debug4("webcrack:unpack");
var Bundle = class {
  type;
  entryId;
  modules;
  constructor(type, entryId, modules) {
    this.type = type;
    this.entryId = entryId;
    this.modules = modules;
  }
  applyMappings(mappings) {
    const mappingPaths = Object.keys(mappings);
    if (mappingPaths.length === 0)
      return;
    const unusedMappings = new Set(mappingPaths);
    for (const module3 of this.modules.values()) {
      traverse_default(module3.ast, {
        enter(path) {
          for (const mappingPath of mappingPaths) {
            if (mappings[mappingPath].match(path.node)) {
              if (unusedMappings.has(mappingPath)) {
                unusedMappings.delete(mappingPath);
              } else {
                logger2(`Mapping ${mappingPath} is already used.`);
                continue;
              }
              const resolvedPath = mappingPath.startsWith("./") ? mappingPath : `node_modules/${mappingPath}`;
              module3.path = resolvedPath;
              path.stop();
              break;
            }
          }
        },
        noScope: true
      });
    }
    if (unusedMappings.size > 0) {
      logger2(`Unused mappings: ${Array.from(unusedMappings).join(", ")}.`);
    }
  }
  /**
   * Saves each module to a file and the bundle metadata to a JSON file.
   * @param path Output directory
   */
  async save(path) {
    const bundleJson = {
      type: this.type,
      entryId: this.entryId,
      modules: Array.from(this.modules.values(), (module3) => ({
        id: module3.id,
        path: module3.path
      }))
    };
    if (true) {
      throw new Error("Not implemented.");
    } else {
      const { mkdir, writeFile } = await null;
      await mkdir(path, { recursive: true });
      await writeFile(
        join2(path, "bundle.json"),
        JSON.stringify(bundleJson, null, 2),
        "utf8"
      );
      await Promise.all(
        Array.from(this.modules.values(), async (module3) => {
          const modulePath = normalize(join2(path, module3.path));
          if (!modulePath.startsWith(path)) {
            throw new Error(`detected path traversal: ${module3.path}`);
          }
          await mkdir(dirname2(modulePath), { recursive: true });
          await writeFile(modulePath, module3.code, "utf8");
        })
      );
    }
  }
  applyTransforms() {
  }
};

// src/extractor/browserify/bundle.ts
var BrowserifyBundle = class extends Bundle {
  constructor(entryId, modules) {
    super("browserify", entryId, modules);
  }
};

// src/extractor/module.ts
var Module = class {
  id;
  isEntry;
  path;
  /**
   * @internal
   */
  ast;
  #code;
  constructor(id, ast, isEntry) {
    this.id = id;
    this.ast = ast;
    this.isEntry = isEntry;
    this.path = `./${isEntry ? "index" : id}.js`;
  }
  /**
   * @internal
   */
  regenerateCode() {
    this.#code = generator_default(this.ast, { jsescOption: { minimal: true } }).code;
    return this.#code;
  }
  get code() {
    return this.#code ?? this.regenerateCode();
  }
  set code(code) {
    this.#code = code;
  }
};

// src/extractor/browserify/module.ts
var BrowserifyModule = class extends Module {
  dependencies;
  constructor(id, ast, isEntry, dependencies) {
    super(id, ast, isEntry);
    this.dependencies = dependencies;
  }
};

// src/extractor/browserify/index.ts
var unpackBrowserify = {
  name: "unpack-browserify",
  tags: ["unsafe"],
  visitor(options) {
    const modules = /* @__PURE__ */ new Map();
    const files = m15.capture(
      m15.arrayOf(
        m15.objectProperty(
          m15.numericLiteral(),
          m15.arrayExpression([
            // function(require, module, exports) {...}
            m15.functionExpression(),
            // dependencies: { './add': 1, 'lib': 3 }
            m15.objectExpression(
              m15.arrayOf(
                m15.objectProperty(
                  constKey(),
                  m15.or(
                    m15.numericLiteral(),
                    m15.identifier("undefined"),
                    m15.stringLiteral()
                  )
                )
              )
            )
          ])
        )
      )
    );
    const entryIdMatcher = m15.capture(m15.numericLiteral());
    const matcher15 = m15.callExpression(
      m15.or(
        // (function (files, cache, entryIds) {...})(...)
        m15.functionExpression(void 0, [
          m15.identifier(),
          m15.identifier(),
          m15.identifier()
        ]),
        // (function () { function init(files, cache, entryIds) {...} return init; })()(...)
        matchIife([
          m15.functionDeclaration(void 0, [
            m15.identifier(),
            m15.identifier(),
            m15.identifier()
          ]),
          m15.returnStatement(m15.identifier())
        ])
      ),
      [
        m15.objectExpression(files),
        m15.objectExpression(),
        m15.arrayExpression([entryIdMatcher])
      ]
    );
    return {
      CallExpression(path) {
        if (!matcher15.match(path.node))
          return;
        path.stop();
        const entryId = entryIdMatcher.current.value.toString();
        const modulesPath = path.get(
          files.currentKeys.join(".")
        );
        const dependencyTree = {};
        for (const moduleWrapper of modulesPath) {
          const id = moduleWrapper.node.key.value.toString();
          const fn = moduleWrapper.get(
            "value.elements.0"
          );
          const dependencies = dependencyTree[id] = {};
          const dependencyProperties = moduleWrapper.get(
            "value.elements.1"
          ).node.properties;
          for (const dependency of dependencyProperties) {
            if (dependency.value.type !== "NumericLiteral" && dependency.value.type !== "StringLiteral")
              continue;
            const filePath = getPropName(dependency.key);
            const depId = dependency.value.value.toString();
            dependencies[depId] = filePath;
          }
          renameParameters(fn, ["require", "module", "exports"]);
          const file3 = t10.file(t10.program(fn.node.body.body));
          const module3 = new BrowserifyModule(
            id,
            file3,
            id === entryId,
            dependencies
          );
          modules.set(id.toString(), module3);
        }
        const resolvedPaths = resolveDependencyTree(dependencyTree, entryId);
        for (const module3 of modules.values()) {
          module3.path = resolvedPaths[module3.id];
        }
        if (modules.size > 0) {
          options.bundle = new BrowserifyBundle(entryId, modules);
        }
      },
      noScope: true
    };
  }
};

// src/extractor/webpack/index.ts
import * as t13 from "@babel/types";
import * as m20 from "@codemod/matchers";

// src/extractor/webpack/bundle.ts
import * as t12 from "@babel/types";
import * as m19 from "@codemod/matchers";

// src/extractor/webpack/esm.ts
import { statement } from "@babel/template";
import * as t11 from "@babel/types";
import * as m16 from "@codemod/matchers";
var buildNamespaceImport = statement`import * as NAME from "PATH";`;
var buildNamedExportLet = statement`export let NAME = VALUE;`;
function convertESM(module3) {
  const defineEsModuleMatcher = m16.expressionStatement(
    m16.callExpression(constMemberExpression("require", "r"), [m16.identifier()])
  );
  const exportsName = m16.capture(m16.identifier());
  const exportedName = m16.capture(m16.anyString());
  const returnedValue = m16.capture(m16.anyExpression());
  const defineExportMatcher = m16.expressionStatement(
    m16.callExpression(constMemberExpression("require", "d"), [
      exportsName,
      m16.stringLiteral(exportedName),
      m16.functionExpression(
        void 0,
        [],
        m16.blockStatement([m16.returnStatement(returnedValue)])
      )
    ])
  );
  const emptyObjectVarMatcher = m16.variableDeclarator(
    m16.fromCapture(exportsName),
    m16.objectExpression([])
  );
  const properties = m16.capture(
    m16.arrayOf(
      m16.objectProperty(
        m16.identifier(),
        m16.arrowFunctionExpression([], m16.anyExpression())
      )
    )
  );
  const defineExportsMatcher = m16.expressionStatement(
    m16.callExpression(constMemberExpression("require", "d"), [
      exportsName,
      m16.objectExpression(properties)
    ])
  );
  const requireVariable = m16.capture(m16.identifier());
  const requiredModuleId = m16.capture(m16.anyNumber());
  const requireMatcher = m16.variableDeclaration(void 0, [
    m16.variableDeclarator(
      requireVariable,
      m16.callExpression(m16.identifier("require"), [
        m16.numericLiteral(requiredModuleId)
      ])
    )
  ]);
  const hmdMatcher = m16.expressionStatement(
    m16.assignmentExpression(
      "=",
      m16.identifier("module"),
      m16.callExpression(constMemberExpression("require", "hmd"))
    )
  );
  traverse_default(module3.ast, {
    enter(path) {
      if (path.parentPath?.parentPath)
        return path.skip();
      if (defineEsModuleMatcher.match(path.node)) {
        module3.ast.program.sourceType = "module";
        path.remove();
      } else if (module3.ast.program.sourceType === "module" && requireMatcher.match(path.node)) {
        path.replaceWith(
          buildNamespaceImport({
            NAME: requireVariable.current,
            PATH: String(requiredModuleId.current)
          })
        );
      } else if (defineExportsMatcher.match(path.node)) {
        const exportsBinding = path.scope.getBinding(exportsName.current.name);
        const emptyObject = emptyObjectVarMatcher.match(
          exportsBinding?.path.node
        ) ? exportsBinding.path.node.init : null;
        for (const property of properties.current) {
          const exportedKey = property.key;
          const returnedValue2 = property.value.body;
          if (emptyObject) {
            emptyObject.properties.push(
              t11.objectProperty(exportedKey, returnedValue2)
            );
          } else {
            exportVariable(path, returnedValue2, exportedKey.name);
          }
        }
        path.remove();
      } else if (defineExportMatcher.match(path.node)) {
        exportVariable(path, returnedValue.current, exportedName.current);
        path.remove();
      } else if (hmdMatcher.match(path.node)) {
        path.remove();
      }
    }
  });
}
function exportVariable(requireDPath, value, exportName) {
  if (value.type === "Identifier") {
    const binding = requireDPath.scope.getBinding(value.name);
    if (!binding)
      return;
    const declaration = findPath(
      binding.path,
      m16.or(
        m16.variableDeclaration(),
        m16.classDeclaration(),
        m16.functionDeclaration()
      )
    );
    if (!declaration)
      return;
    if (exportName === "default") {
      declaration.replaceWith(
        t11.exportDefaultDeclaration(
          t11.isVariableDeclaration(declaration.node) ? declaration.node.declarations[0].init : declaration.node
        )
      );
    } else {
      renameFast(binding, exportName);
      declaration.replaceWith(t11.exportNamedDeclaration(declaration.node));
    }
  } else if (exportName === "default") {
    requireDPath.insertAfter(t11.exportDefaultDeclaration(value));
  } else {
    requireDPath.insertAfter(
      buildNamedExportLet({ NAME: t11.identifier(exportName), VALUE: value })
    );
  }
}

// src/extractor/webpack/getDefaultExport.ts
import { expression as expression2 } from "@babel/template";
import * as m17 from "@codemod/matchers";
function convertDefaultRequire(bundle) {
  function getRequiredModule(path) {
    const binding = path.scope.getBinding(moduleArg.current.name);
    const declarator = binding?.path.node;
    if (declaratorMatcher.match(declarator)) {
      return bundle.modules.get(requiredModuleId.current.value.toString());
    }
  }
  const requiredModuleId = m17.capture(m17.numericLiteral());
  const declaratorMatcher = m17.variableDeclarator(
    m17.identifier(),
    m17.callExpression(m17.identifier("require"), [requiredModuleId])
  );
  const moduleArg = m17.capture(m17.identifier());
  const getterVarName = m17.capture(m17.identifier());
  const requireN = m17.callExpression(constMemberExpression("require", "n"), [
    moduleArg
  ]);
  const defaultRequireMatcher = m17.variableDeclarator(getterVarName, requireN);
  const defaultRequireMatcherAlternative = m17.or(
    constMemberExpression(requireN, "a"),
    m17.callExpression(requireN, [])
  );
  const buildDefaultAccess = expression2`OBJECT.default`;
  bundle.modules.forEach((module3) => {
    traverse_default(module3.ast, {
      "CallExpression|MemberExpression"(path) {
        if (defaultRequireMatcherAlternative.match(path.node)) {
          const requiredModule = getRequiredModule(path);
          if (requiredModule?.ast.program.sourceType === "module") {
            path.replaceWith(
              buildDefaultAccess({ OBJECT: moduleArg.current })
            );
          } else {
            path.replaceWith(moduleArg.current);
          }
        }
      },
      VariableDeclarator(path) {
        if (defaultRequireMatcher.match(path.node)) {
          const requiredModule = getRequiredModule(path);
          const init = path.get("init");
          if (requiredModule?.ast.program.sourceType === "module") {
            init.replaceWith(
              buildDefaultAccess({ OBJECT: moduleArg.current })
            );
          } else {
            init.replaceWith(moduleArg.current);
          }
          const binding = path.scope.getOwnBinding(getterVarName.current.name);
          binding?.referencePaths.forEach((refPath) => {
            if (refPath.parentPath?.isCallExpression() || refPath.parentPath?.isMemberExpression()) {
              refPath.parentPath.replaceWith(refPath);
            }
          });
        }
      },
      noScope: true
    });
  });
}

// src/extractor/webpack/varInjection.ts
import { statement as statement2 } from "@babel/template";
import * as m18 from "@codemod/matchers";
var buildVar = statement2`var NAME = INIT;`;
function inlineVarInjections(module3) {
  const { program: program3 } = module3.ast;
  const newBody = [];
  const body = m18.capture(m18.blockStatement());
  const params = m18.capture(m18.arrayOf(m18.identifier()));
  const args = m18.capture(
    m18.anyList(m18.or(m18.thisExpression(), m18.identifier("exports")), m18.oneOrMore())
  );
  const matcher15 = m18.expressionStatement(
    m18.callExpression(
      constMemberExpression(
        m18.functionExpression(void 0, params, body),
        "call"
      ),
      args
    )
  );
  for (const node of program3.body) {
    if (matcher15.match(node)) {
      const vars = params.current.map(
        (param, i) => buildVar({ NAME: param, INIT: args.current[i + 1] })
      );
      newBody.push(...vars);
      newBody.push(...body.current.body);
    } else {
      newBody.push(node);
    }
  }
  program3.body = newBody;
}

// src/extractor/webpack/bundle.ts
var WebpackBundle = class extends Bundle {
  constructor(entryId, modules) {
    super("webpack", entryId, modules);
  }
  /**
   * Undoes some of the transformations that Webpack injected into the modules.
   */
  applyTransforms() {
    this.modules.forEach(inlineVarInjections);
    this.modules.forEach(convertESM);
    convertDefaultRequire(this);
    this.replaceRequirePaths();
  }
  /**
   * Replaces `require(id)` calls with `require("./relative/path.js")` calls.
   */
  replaceRequirePaths() {
    const requireId = m19.capture(m19.or(m19.numericLiteral(), m19.stringLiteral()));
    const requireMatcher = m19.or(
      m19.callExpression(m19.identifier("require"), [requireId])
    );
    const importId = m19.capture(m19.stringLiteral());
    const importMatcher = m19.importDeclaration(m19.anything(), importId);
    this.modules.forEach((module3) => {
      traverse_default(module3.ast, {
        "CallExpression|ImportDeclaration": (path) => {
          let moduleId;
          let arg;
          if (requireMatcher.match(path.node)) {
            moduleId = requireId.current.value.toString();
            [arg] = path.get("arguments");
          } else if (importMatcher.match(path.node)) {
            moduleId = importId.current.value;
            arg = path.get("source");
          } else {
            return;
          }
          const requiredModule = this.modules.get(moduleId);
          arg.replaceWith(
            t12.stringLiteral(
              relativePath(
                module3.path,
                requiredModule?.path ?? `./${moduleId}.js`
              )
            )
          );
          if (!requiredModule) {
            arg.addComment("leading", "webcrack:missing");
          }
        },
        noScope: true
      });
    });
  }
};

// src/extractor/webpack/module.ts
var WebpackModule = class extends Module {
};

// src/extractor/webpack/index.ts
var unpackWebpack = {
  name: "unpack-webpack",
  tags: ["unsafe"],
  visitor(options) {
    const modules = /* @__PURE__ */ new Map();
    const entryIdMatcher = m20.capture(m20.numericLiteral());
    const moduleFunctionsMatcher = m20.capture(
      m20.or(
        // E.g. [,,function (e, t, i) {...}, ...], index is the module ID
        m20.arrayExpression(
          m20.arrayOf(
            m20.or(m20.functionExpression(), m20.arrowFunctionExpression(), null)
          )
        ),
        // E.g. {0: function (e, t, i) {...}, ...}, key is the module ID
        m20.objectExpression(
          m20.arrayOf(
            m20.or(
              m20.objectProperty(
                m20.or(m20.numericLiteral(), m20.stringLiteral(), m20.identifier()),
                m20.or(m20.functionExpression(), m20.arrowFunctionExpression())
              ),
              // __webpack_public_path__ (c: "")
              m20.objectProperty(constKey("c"), m20.stringLiteral())
            )
          )
        )
      )
    );
    const webpack4Matcher = m20.callExpression(
      m20.functionExpression(
        void 0,
        void 0,
        m20.blockStatement(
          m20.anyList(
            m20.zeroOrMore(),
            m20.functionDeclaration(),
            m20.zeroOrMore(),
            m20.containerOf(
              m20.or(
                // E.g. __webpack_require__.s = 2
                m20.assignmentExpression(
                  "=",
                  constMemberExpression(m20.identifier(), "s"),
                  entryIdMatcher
                ),
                // E.g. return require(0);
                m20.callExpression(m20.identifier(), [entryIdMatcher])
              )
            )
          )
        )
      ),
      [moduleFunctionsMatcher]
    );
    const webpack5Matcher = m20.callExpression(
      m20.arrowFunctionExpression(
        void 0,
        m20.blockStatement(
          m20.anyList(
            m20.zeroOrMore(),
            m20.variableDeclaration(void 0, [
              m20.variableDeclarator(void 0, moduleFunctionsMatcher)
            ]),
            // var installedModules = {};
            m20.variableDeclaration(),
            m20.zeroOrMore(),
            m20.containerOf(
              // __webpack_require__.s = 2
              m20.assignmentExpression(
                "=",
                constMemberExpression(m20.identifier(), "s"),
                entryIdMatcher
              )
            ),
            // module.exports = entryModule
            m20.expressionStatement(
              m20.assignmentExpression(
                "=",
                constMemberExpression(m20.identifier(), "exports"),
                m20.identifier()
              )
            )
          )
        )
      )
    );
    const jsonpGlobal = m20.capture(
      constMemberExpression(
        m20.or(m20.identifier(m20.or("self", "window")), m20.thisExpression()),
        m20.matcher((s) => s.startsWith("webpack"))
      )
    );
    const jsonpMatcher = m20.callExpression(
      constMemberExpression(
        m20.assignmentExpression(
          "=",
          jsonpGlobal,
          m20.logicalExpression(
            "||",
            m20.fromCapture(jsonpGlobal),
            m20.arrayExpression([])
          )
        ),
        "push"
      ),
      [
        m20.arrayExpression(
          m20.anyList(
            m20.arrayExpression([m20.numericLiteral()]),
            // chunkId
            moduleFunctionsMatcher,
            m20.slice({ max: 1 })
            // optional entry point like [["57iH",19,24,25]]
          )
        )
      ]
    );
    return {
      CallExpression(path) {
        if (!webpack4Matcher.match(path.node) && !webpack5Matcher.match(path.node) && !jsonpMatcher.match(path.node))
          return;
        path.stop();
        const modulesPath = path.get(
          moduleFunctionsMatcher.currentKeys.join(".")
        );
        const moduleWrappers = modulesPath.isArrayExpression() ? modulesPath.get("elements") : modulesPath.get("properties");
        moduleWrappers.forEach((moduleWrapper, index) => {
          let moduleId = index.toString();
          if (t13.isObjectProperty(moduleWrapper.node)) {
            moduleId = getPropName(moduleWrapper.node.key);
            moduleWrapper = moduleWrapper.get("value");
          }
          if (moduleWrapper.isFunction() && moduleWrapper.node.body.type === "BlockStatement") {
            renameParameters(moduleWrapper, ["module", "exports", "require"]);
            const file3 = t13.file(t13.program(moduleWrapper.node.body.body));
            const lastNode = file3.program.body.at(-1);
            if (lastNode?.trailingComments?.length === 1 && lastNode.trailingComments[0].value === "*") {
              lastNode.trailingComments = null;
            }
            const module3 = new WebpackModule(
              moduleId,
              file3,
              moduleId === entryIdMatcher.current?.value.toString()
            );
            modules.set(moduleId, module3);
          }
        });
        if (modules.size > 0) {
          const entryId = entryIdMatcher.current?.value.toString() ?? "";
          options.bundle = new WebpackBundle(entryId, modules);
        }
      },
      noScope: true
    };
  }
};

// src/extractor/index.ts
function unpackBundle(ast, mappings = {}) {
  const options = { bundle: void 0 };
  const traverseOptions = [
    unpackWebpack.visitor(options),
    unpackBrowserify.visitor(options)
  ];
  const visitor = traverse_exports.visitors.merge(traverseOptions);
  visitor.noScope = traverseOptions.every((v) => v.noScope);
  traverse_default(ast, visitor, void 0, { changes: 0 });
  if (options.bundle) {
    options.bundle.applyMappings(mappings);
    options.bundle.applyTransforms();
    debug5("webcrack:unpack")("Bundle:", options.bundle.type);
  }
  return options.bundle;
}

// src/transforms/blockStatement.ts
import * as t14 from "@babel/types";
var blockStatement_default = {
  name: "blockStatement",
  tags: ["safe"],
  visitor: () => ({
    IfStatement: {
      exit(path) {
        if (!t14.isBlockStatement(path.node.consequent) && !t14.isEmptyStatement(path.node.consequent)) {
          path.node.consequent = t14.blockStatement([path.node.consequent]);
          this.changes++;
        }
        if (path.node.alternate && !t14.isBlockStatement(path.node.alternate)) {
          path.node.alternate = t14.blockStatement([path.node.alternate]);
          this.changes++;
        }
      }
    },
    Loop: {
      exit(path) {
        if (!t14.isBlockStatement(path.node.body) && !t14.isEmptyStatement(path.node.body)) {
          path.node.body = t14.blockStatement([path.node.body]);
          this.changes++;
        }
      }
    },
    ArrowFunctionExpression: {
      exit(path) {
        if (t14.isSequenceExpression(path.node.body)) {
          path.node.body = t14.blockStatement([
            t14.returnStatement(path.node.body)
          ]);
          this.changes++;
        }
      }
    },
    noScope: true
  })
};

// src/transforms/jsx.ts
import * as t15 from "@babel/types";
import * as m21 from "@codemod/matchers";
var jsx_default = {
  name: "jsx",
  tags: ["unsafe"],
  visitor: () => {
    const deepIdentifierMemberExpression = m21.memberExpression(
      m21.or(
        m21.identifier(),
        m21.matcher((node) => deepIdentifierMemberExpression.match(node))
      ),
      m21.identifier(),
      false
    );
    const type = m21.capture(
      m21.or(
        m21.identifier(),
        // React.createElement(Component, ...)
        m21.stringLiteral(),
        // React.createElement('div', ...)
        deepIdentifierMemberExpression
        // React.createElement(Component.SubComponent, ...)
      )
    );
    const props = m21.capture(m21.or(m21.objectExpression(), m21.nullLiteral()));
    const elementMatcher = m21.callExpression(
      constMemberExpression("React", "createElement"),
      m21.anyList(type, props, m21.zeroOrMore(m21.anyExpression()))
    );
    const fragmentMatcher = m21.callExpression(
      constMemberExpression("React", "createElement"),
      m21.anyList(
        constMemberExpression("React", "Fragment"),
        m21.nullLiteral(),
        m21.zeroOrMore(m21.anyExpression())
      )
    );
    return {
      CallExpression: {
        exit(path) {
          if (fragmentMatcher.match(path.node)) {
            const children = convertChildren(
              path.node.arguments.slice(2)
            );
            const opening = t15.jsxOpeningFragment();
            const closing = t15.jsxClosingFragment();
            const fragment = t15.jsxFragment(opening, closing, children);
            path.replaceWith(fragment);
            this.changes++;
          }
          if (elementMatcher.match(path.node)) {
            let name = convertType(type.current);
            if (t15.isIdentifier(type.current) && /^[a-z]/.test(type.current.name)) {
              const binding = path.scope.getBinding(type.current.name);
              if (!binding)
                return;
              name = t15.jsxIdentifier(path.scope.generateUid("Component"));
              path.scope.rename(type.current.name, name.name);
            }
            const attributes = t15.isObjectExpression(props.current) ? convertAttributes(props.current) : [];
            const children = convertChildren(
              path.node.arguments.slice(2)
            );
            const opening = t15.jsxOpeningElement(name, attributes);
            const closing = t15.jsxClosingElement(name);
            const element = t15.jsxElement(opening, closing, children);
            path.replaceWith(element);
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};
function convertType(type) {
  if (t15.isIdentifier(type)) {
    return t15.jsxIdentifier(type.name);
  } else if (t15.isStringLiteral(type)) {
    return t15.jsxIdentifier(type.value);
  } else {
    const object = convertType(
      type.object
    );
    const property = t15.jsxIdentifier(type.property.name);
    return t15.jsxMemberExpression(object, property);
  }
}
function convertAttributes(object) {
  const name = m21.capture(m21.anyString());
  const value = m21.capture(m21.anyExpression());
  const matcher15 = m21.objectProperty(
    m21.or(m21.identifier(name), m21.stringLiteral(name)),
    value
  );
  return object.properties.map((property) => {
    if (matcher15.match(property)) {
      const jsxName = t15.jsxIdentifier(name.current);
      const jsxValue = value.current.type === "StringLiteral" ? value.current : t15.jsxExpressionContainer(value.current);
      return t15.jsxAttribute(jsxName, jsxValue);
    } else if (t15.isSpreadElement(property)) {
      return t15.jsxSpreadAttribute(property.argument);
    } else {
      throw new Error(
        `jsx: property type not implemented ${codePreview(object)}`
      );
    }
  });
}
function convertChildren(children) {
  return children.map((child) => {
    if (t15.isJSXElement(child)) {
      return child;
    } else if (t15.isStringLiteral(child)) {
      return t15.jsxText(child.value);
    } else {
      return t15.jsxExpressionContainer(child);
    }
  });
}

// src/transforms/jsx-new.ts
import * as t16 from "@babel/types";
import * as m22 from "@codemod/matchers";
var jsx_new_default = {
  name: "jsx-new",
  tags: ["unsafe"],
  visitor: () => {
    const deepIdentifierMemberExpression = m22.memberExpression(
      m22.or(
        m22.identifier(),
        m22.matcher((node) => deepIdentifierMemberExpression.match(node))
      ),
      m22.identifier(),
      false
    );
    const type = m22.capture(
      m22.or(
        m22.identifier(),
        // jsx(Component, ...)
        m22.stringLiteral(),
        // jsx('div', ...)
        deepIdentifierMemberExpression
        // jsx(Component.SubComponent, ...)
      )
    );
    const fragmentType = constMemberExpression("React", "Fragment");
    const props = m22.capture(m22.objectExpression());
    const key = m22.capture(m22.anyExpression());
    const jsxFunction = m22.capture(m22.or("jsx", "jsxs"));
    const jsxMatcher = m22.callExpression(
      m22.identifier(jsxFunction),
      m22.anyList(type, props, m22.slice({ min: 0, max: 1, matcher: key }))
    );
    return {
      CallExpression: {
        exit(path) {
          if (!jsxMatcher.match(path.node))
            return;
          let name = convertType2(type.current);
          const isFragment = fragmentType.match(type.current);
          if (t16.isIdentifier(type.current) && /^[a-z]/.test(type.current.name)) {
            const binding = path.scope.getBinding(type.current.name);
            if (!binding)
              return;
            name = t16.jsxIdentifier(path.scope.generateUid("Component"));
            path.scope.rename(type.current.name, name.name);
          }
          const attributes = convertAttributes2(props.current);
          if (path.node.arguments.length === 3) {
            attributes.push(
              t16.jsxAttribute(
                t16.jsxIdentifier("key"),
                convertAttributeValue(key.current)
              )
            );
          }
          const children = convertChildren2(
            props.current,
            jsxFunction.current
          );
          if (isFragment && attributes.length === 0) {
            const opening = t16.jsxOpeningFragment();
            const closing = t16.jsxClosingFragment();
            const fragment = t16.jsxFragment(opening, closing, children);
            path.replaceWith(fragment);
          } else {
            const opening = t16.jsxOpeningElement(name, attributes);
            const closing = t16.jsxClosingElement(name);
            const element = t16.jsxElement(opening, closing, children);
            path.replaceWith(element);
          }
          this.changes++;
        }
      },
      noScope: true
    };
  }
};
function convertType2(type) {
  if (t16.isIdentifier(type)) {
    return t16.jsxIdentifier(type.name);
  } else if (t16.isStringLiteral(type)) {
    return t16.jsxIdentifier(type.value);
  } else {
    const object = convertType2(
      type.object
    );
    const property = t16.jsxIdentifier(type.property.name);
    return t16.jsxMemberExpression(object, property);
  }
}
function convertAttributes2(object) {
  const name = m22.capture(m22.anyString());
  const value = m22.capture(m22.anyExpression());
  const matcher15 = m22.objectProperty(
    m22.or(m22.identifier(name), m22.stringLiteral(name)),
    value
  );
  return object.properties.flatMap((property) => {
    if (matcher15.match(property)) {
      if (name.current === "children")
        return [];
      const jsxName = t16.jsxIdentifier(name.current);
      const jsxValue = convertAttributeValue(value.current);
      return t16.jsxAttribute(jsxName, jsxValue);
    } else if (t16.isSpreadElement(property)) {
      return t16.jsxSpreadAttribute(property.argument);
    } else {
      throw new Error(
        `jsx: property type not implemented ${codePreview(object)}`
      );
    }
  });
}
function convertAttributeValue(expression3) {
  return expression3.type === "StringLiteral" ? expression3 : t16.jsxExpressionContainer(expression3);
}
function convertChildren2(object, fn) {
  const children = m22.capture(m22.anyExpression());
  const matcher15 = m22.objectProperty(
    m22.or(m22.identifier("children"), m22.stringLiteral("children")),
    children
  );
  const prop = object.properties.find((prop2) => matcher15.match(prop2));
  if (!prop)
    return [];
  if (fn === "jsxs" && t16.isArrayExpression(children.current)) {
    return children.current.elements.map(
      (child) => convertChild(child)
    );
  }
  return [convertChild(children.current)];
}
function convertChild(child) {
  if (t16.isJSXElement(child)) {
    return child;
  } else if (t16.isStringLiteral(child)) {
    return t16.jsxText(child.value);
  } else {
    return t16.jsxExpressionContainer(child);
  }
}

// src/transforms/mangle.ts
import * as t17 from "@babel/types";
import mangle from "babel-plugin-minify-mangle-names";
var mangle_default = {
  name: "mangle",
  tags: ["safe"],
  run(ast) {
    const { getSource } = traverse_exports.NodePath.prototype;
    traverse_exports.NodePath.prototype.getSource = () => "";
    traverse_default(ast, mangle({ types: t17, traverse: traverse_default }).visitor, void 0, {
      opts: {
        eval: true,
        topLevel: true,
        exclude: { React: true }
      }
    });
    traverse_exports.NodePath.prototype.getSource = getSource;
  }
};

// src/transforms/sequence.ts
import * as t18 from "@babel/types";
import * as m23 from "@codemod/matchers";
var sequence_default = {
  name: "sequence",
  tags: ["safe"],
  visitor: () => ({
    ExpressionStatement: {
      exit(path) {
        if (t18.isSequenceExpression(path.node.expression)) {
          const statements = path.node.expression.expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.replaceWithMultiple(statements);
          this.changes++;
        }
      }
    },
    ReturnStatement: {
      exit(path) {
        if (t18.isSequenceExpression(path.node.argument)) {
          const expressions = path.node.argument.expressions;
          path.node.argument = expressions.pop();
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          this.changes++;
        } else if (t18.isUnaryExpression(path.node.argument, { operator: "void" }) && t18.isSequenceExpression(path.node.argument.argument)) {
          const expressions = path.node.argument.argument.expressions;
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          path.node.argument = null;
          this.changes++;
        }
      }
    },
    IfStatement: {
      exit(path) {
        if (t18.isSequenceExpression(path.node.test)) {
          const expressions = path.node.test.expressions;
          path.node.test = expressions.pop();
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          this.changes++;
        }
      }
    },
    SwitchStatement: {
      exit(path) {
        if (t18.isSequenceExpression(path.node.discriminant)) {
          const expressions = path.node.discriminant.expressions;
          path.node.discriminant = expressions.pop();
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          this.changes++;
        }
      }
    },
    ThrowStatement: {
      exit(path) {
        if (t18.isSequenceExpression(path.node.argument)) {
          const expressions = path.node.argument.expressions;
          path.node.argument = expressions.pop();
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          this.changes++;
        }
      }
    },
    ForInStatement: {
      exit(path) {
        const sequence = m23.capture(m23.sequenceExpression());
        const matcher15 = m23.forInStatement(m23.anything(), sequence);
        if (matcher15.match(path.node)) {
          const expressions = sequence.current.expressions;
          path.node.right = expressions.pop();
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          this.changes++;
        }
      }
    },
    ForStatement: {
      exit(path) {
        if (t18.isSequenceExpression(path.node.init)) {
          const statements = path.node.init.expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          path.insertBefore(statements);
          path.node.init = null;
          this.changes++;
        }
      }
    },
    VariableDeclaration: {
      exit(path) {
        const sequence = m23.capture(m23.sequenceExpression());
        const matcher15 = m23.variableDeclaration(void 0, [
          m23.variableDeclarator(void 0, sequence)
        ]);
        if (matcher15.match(path.node)) {
          const expressions = sequence.current.expressions;
          path.node.declarations[0].init = expressions.pop();
          const statements = expressions.map(
            (expr) => t18.expressionStatement(expr)
          );
          if (path.parentPath.isForStatement() && path.key === "init") {
            path.parentPath.insertBefore(statements);
          } else {
            path.insertBefore(statements);
          }
          this.changes++;
        }
      }
    },
    noScope: true
  })
};

// src/transforms/splitVariableDeclarations.ts
import * as t19 from "@babel/types";
var splitVariableDeclarations_default = {
  name: "splitVariableDeclarations",
  tags: ["safe"],
  visitor: () => ({
    VariableDeclaration: {
      exit(path) {
        if (path.node.declarations.length > 1 && path.key !== "init") {
          if (path.parentPath.isExportNamedDeclaration()) {
            path.parentPath.replaceWithMultiple(
              path.node.declarations.map(
                (declaration) => t19.exportNamedDeclaration(
                  t19.variableDeclaration(path.node.kind, [declaration])
                )
              )
            );
          } else {
            path.replaceWithMultiple(
              path.node.declarations.map(
                (declaration) => t19.variableDeclaration(path.node.kind, [declaration])
              )
            );
          }
          this.changes++;
        }
      }
    },
    noScope: true
  })
};

// src/transforms/booleanIf.ts
import { statement as statement3 } from "@babel/template";
import * as m24 from "@codemod/matchers";
var booleanIf_default = {
  name: "booleanIf",
  tags: ["safe"],
  visitor: () => {
    const andMatcher = m24.expressionStatement(m24.logicalExpression("&&"));
    const orMatcher = m24.expressionStatement(m24.logicalExpression("||"));
    const buildIf = statement3`if (TEST) { BODY; }`;
    const buildIfNot = statement3`if (!TEST) { BODY; }`;
    return {
      ExpressionStatement: {
        exit(path) {
          const expression3 = path.node.expression;
          if (andMatcher.match(path.node)) {
            path.replaceWith(
              buildIf({
                TEST: expression3.left,
                BODY: expression3.right
              })
            );
            this.changes++;
          } else if (orMatcher.match(path.node)) {
            path.replaceWith(
              buildIfNot({
                TEST: expression3.left,
                BODY: expression3.right
              })
            );
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/computedProperties.ts
import { isIdentifierName } from "@babel/helper-validator-identifier";
import * as t20 from "@babel/types";
import * as m25 from "@codemod/matchers";
var computedProperties_default = {
  name: "computedProperties",
  tags: ["safe"],
  visitor() {
    const stringMatcher = m25.capture(
      m25.stringLiteral(m25.matcher((value) => isIdentifierName(value)))
    );
    const propertyMatcher = m25.or(
      m25.memberExpression(m25.anything(), stringMatcher, true),
      m25.optionalMemberExpression(m25.anything(), stringMatcher, true)
    );
    const keyMatcher = m25.or(
      m25.objectProperty(stringMatcher),
      m25.classProperty(stringMatcher),
      m25.objectMethod(void 0, stringMatcher),
      m25.classMethod(void 0, stringMatcher)
    );
    return {
      "MemberExpression|OptionalMemberExpression": {
        exit(path) {
          if (propertyMatcher.match(path.node)) {
            path.node.computed = false;
            path.node.property = t20.identifier(stringMatcher.current.value);
            this.changes++;
          }
        }
      },
      "ObjectProperty|ClassProperty|ObjectMethod|ClassMethod": {
        exit(path) {
          if (keyMatcher.match(path.node)) {
            path.node.computed = false;
            path.node.key = t20.identifier(stringMatcher.current.value);
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/jsonParse.ts
import { parseExpression } from "@babel/parser";
import * as m26 from "@codemod/matchers";
var jsonParse_default = {
  name: "jsonParse",
  tags: ["safe"],
  visitor: () => {
    const string = m26.capture(m26.anyString());
    const matcher15 = m26.callExpression(constMemberExpression("JSON", "parse"), [
      m26.stringLiteral(string)
    ]);
    return {
      CallExpression: {
        exit(path) {
          if (matcher15.match(path.node)) {
            try {
              JSON.parse(string.current);
              const parsed = parseExpression(string.current);
              path.replaceWith(parsed);
              this.changes++;
            } catch (error) {
            }
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/mergeElseIf.ts
import * as m27 from "@codemod/matchers";
var mergeElseIf_default = {
  name: "mergeElseIf",
  tags: ["safe"],
  visitor() {
    const nestedIf = m27.capture(m27.ifStatement());
    const matcher15 = m27.ifStatement(
      m27.anything(),
      m27.anything(),
      m27.blockStatement([nestedIf])
    );
    return {
      IfStatement: {
        exit(path) {
          if (matcher15.match(path.node)) {
            const alternate = path.get("alternate");
            alternate.replaceWith(nestedIf.current);
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/numberExpressions.ts
import * as t21 from "@babel/types";
import * as m28 from "@codemod/matchers";
var numberExpressions_default = {
  name: "numberExpressions",
  tags: ["safe"],
  visitor: () => ({
    "BinaryExpression|UnaryExpression": {
      exit(path) {
        if (matcher13.match(path.node)) {
          const evaluated = path.evaluate();
          if (evaluated.confident) {
            path.replaceWith(t21.valueToNode(evaluated.value));
            path.skip();
            this.changes++;
          }
        }
      }
    },
    noScope: true
  })
};
var matcher13 = m28.or(
  m28.binaryExpression(
    m28.or("+", "-", "*"),
    m28.matcher((node) => matcher13.match(node)),
    m28.matcher((node) => matcher13.match(node))
  ),
  m28.binaryExpression(
    "-",
    m28.or(
      m28.stringLiteral(),
      m28.matcher((node) => matcher13.match(node))
    ),
    m28.or(
      m28.stringLiteral(),
      m28.matcher((node) => matcher13.match(node))
    )
  ),
  m28.unaryExpression(
    "-",
    m28.or(
      m28.stringLiteral(),
      m28.matcher((node) => matcher13.match(node))
    )
  ),
  m28.numericLiteral()
);

// src/transforms/rawLiterals.ts
var rawLiterals_default = {
  name: "rawLiterals",
  tags: ["safe"],
  visitor: () => ({
    StringLiteral(path) {
      if (path.node.extra) {
        path.node.extra = void 0;
        this.changes++;
      }
    },
    NumericLiteral(path) {
      if (path.node.extra) {
        path.node.extra = void 0;
        this.changes++;
      }
    },
    noScope: true
  })
};

// src/transforms/ternaryToIf.ts
import { statement as statement4 } from "@babel/template";
import * as m29 from "@codemod/matchers";
var ternaryToIf_default = {
  name: "ternaryToIf",
  tags: ["safe"],
  visitor() {
    const test = m29.capture(m29.anyExpression());
    const consequent = m29.capture(m29.anyExpression());
    const alternate = m29.capture(m29.anyExpression());
    const conditional = m29.conditionalExpression(test, consequent, alternate);
    const buildIf = statement4`if (TEST) { CONSEQUENT; } else { ALTERNATE; }`;
    const buildIfReturn = statement4`if (TEST) { return CONSEQUENT; } else { return ALTERNATE; }`;
    return {
      ExpressionStatement: {
        exit(path) {
          if (conditional.match(path.node.expression)) {
            path.replaceWith(
              buildIf({
                TEST: test.current,
                CONSEQUENT: consequent.current,
                ALTERNATE: alternate.current
              })
            );
            this.changes++;
          }
        }
      },
      ReturnStatement: {
        exit(path) {
          if (conditional.match(path.node.argument)) {
            path.replaceWith(
              buildIfReturn({
                TEST: test.current,
                CONSEQUENT: consequent.current,
                ALTERNATE: alternate.current
              })
            );
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/unminifyBooleans.ts
import * as t22 from "@babel/types";
import * as m30 from "@codemod/matchers";
var unminifyBooleans_default = {
  name: "unminifyBooleans",
  tags: ["safe"],
  visitor: () => ({
    UnaryExpression(path) {
      if (trueMatcher2.match(path.node)) {
        path.replaceWith(t22.booleanLiteral(true));
        this.changes++;
      } else if (falseMatcher2.match(path.node)) {
        path.replaceWith(t22.booleanLiteral(false));
        this.changes++;
      }
    },
    noScope: true
  })
};
var trueMatcher2 = m30.or(
  m30.unaryExpression("!", m30.numericLiteral(0)),
  m30.unaryExpression("!", m30.unaryExpression("!", m30.numericLiteral(1))),
  m30.unaryExpression("!", m30.unaryExpression("!", m30.arrayExpression([])))
);
var falseMatcher2 = m30.or(
  m30.unaryExpression("!", m30.numericLiteral(1)),
  m30.unaryExpression("!", m30.arrayExpression([]))
);

// src/transforms/void0ToUndefined.ts
import * as t23 from "@babel/types";
import * as m31 from "@codemod/matchers";
var void0ToUndefined_default = {
  name: "void0ToUndefined",
  tags: ["safe"],
  visitor: () => {
    const matcher15 = m31.unaryExpression("void", m31.numericLiteral(0));
    return {
      UnaryExpression: {
        exit(path) {
          if (matcher15.match(path.node)) {
            path.replaceWith(t23.identifier("undefined"));
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/yoda.ts
import * as t24 from "@babel/types";
import * as m32 from "@codemod/matchers";
var flippedOperators = {
  "==": "==",
  "===": "===",
  "!=": "!=",
  "!==": "!==",
  ">": "<",
  "<": ">",
  ">=": "<=",
  "<=": ">=",
  "*": "*",
  "^": "^",
  "&": "&",
  "|": "|"
};
var yoda_default = {
  name: "yoda",
  tags: ["safe"],
  visitor: () => {
    const matcher15 = m32.binaryExpression(
      m32.or(...Object.values(flippedOperators)),
      m32.or(
        m32.stringLiteral(),
        m32.numericLiteral(),
        m32.unaryExpression("-", m32.numericLiteral()),
        m32.booleanLiteral(),
        m32.nullLiteral(),
        m32.identifier("undefined"),
        m32.identifier("NaN"),
        m32.identifier("Infinity")
      ),
      m32.matcher((node) => !t24.isLiteral(node))
    );
    return {
      BinaryExpression: {
        exit({ node }) {
          if (matcher15.match(node)) {
            [node.left, node.right] = [node.right, node.left];
            node.operator = flippedOperators[node.operator];
            this.changes++;
          }
        }
      },
      noScope: true
    };
  }
};

// src/transforms/unminify.ts
var unminify_default = {
  name: "unminify",
  tags: ["safe"],
  visitor() {
    const traverseOptions = [
      rawLiterals_default.visitor(),
      blockStatement_default.visitor(),
      mergeStrings_default.visitor(),
      computedProperties_default.visitor(),
      splitVariableDeclarations_default.visitor(),
      sequence_default.visitor(),
      numberExpressions_default.visitor(),
      unminifyBooleans_default.visitor(),
      booleanIf_default.visitor(),
      ternaryToIf_default.visitor(),
      mergeElseIf_default.visitor(),
      void0ToUndefined_default.visitor(),
      yoda_default.visitor(),
      jsonParse_default.visitor()
    ];
    const visitor = traverse_exports.visitors.merge(traverseOptions);
    visitor.noScope = traverseOptions.every((t25) => t25.noScope);
    return visitor;
  }
};

// src/index.ts
function mergeOptions(options) {
  const mergedOptions = {
    jsx: true,
    unpack: true,
    deobfuscate: true,
    mangle: false,
    mappings: () => ({}),
    sandbox: true ? createBrowserSandbox() : createNodeSandbox(),
    ...options
  };
  Object.assign(options, mergedOptions);
}
async function webcrack(code, options = {}) {
  mergeOptions(options);
  if (true) {
    debug6.enable("webcrack:*");
  }
  const ast = parse(code, {
    sourceType: "unambiguous",
    allowReturnOutsideFunction: true,
    plugins: ["jsx"]
  });
  applyTransforms(
    ast,
    [blockStatement_default, sequence_default, splitVariableDeclarations_default],
    "prepare"
  );
  if (options.deobfuscate)
    await applyTransformAsync(ast, deobfuscator_default, options.sandbox);
  const unminifyWrapper = {
    ...unminify_default,
    visitor: () => ({ ...unminify_default.visitor(), noScope: options.deobfuscate })
  };
  applyTransform(ast, unminifyWrapper);
  if (options.mangle)
    applyTransform(ast, mangle_default);
  applyTransforms(
    ast,
    [
      // Have to run this after unminify to properly detect it
      options.deobfuscate ? [selfDefending_default, debugProtection_default] : [],
      options.jsx ? [jsx_default, jsx_new_default] : []
    ].flat()
  );
  if (options.deobfuscate)
    applyTransform(ast, mergeObjectAssignments_default);
  const outputCode = generator_default(ast, { jsescOption: { minimal: true } }).code;
  const bundle = options.unpack ? unpackBundle(ast, options.mappings(m33)) : void 0;
  return {
    code: outputCode,
    bundle,
    async save(path) {
      path = normalize2(path);
      if (true) {
        throw new Error("Not implemented.");
      } else {
        const { mkdir, writeFile } = await null;
        await mkdir(path, { recursive: true });
        await writeFile(join3(path, "deobfuscated.js"), outputCode, "utf8");
        await bundle?.save(path);
      }
    }
  };
}
export {
  webcrack
};
//# sourceMappingURL=browser.js.map
