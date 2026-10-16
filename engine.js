/**
 * Data Structure Visualizer - Multi-Language Execution & Tracing Engine (Version 2.0)
 * Client-Side Interpreters with Genuine AST-Driven Execution Tracing for:
 * 1. C (C99)
 * 2. Python (3.x)
 * 3. Java (17)
 *
 * Supports: Arrays, Singly Linked Lists, Stacks, Queues, Binary Search Trees,
 * Searching/Sorting Algorithms, Loops, and Step-by-Step Pattern Printing.
 * Developer Credit: Developed by Pratiyush Jaiswal
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // --- Exceptions ---
  class ParseError extends Error {
    constructor(message, line) {
      super(line ? `Line ${line}: ${message}` : message);
      this.name = 'ParseError';
      this.line = line;
    }
  }

  class RuntimeErrorEx extends Error {
    constructor(message, line) {
      super(line ? `Line ${line}: ${message}` : message);
      this.name = 'RuntimeErrorEx';
      this.line = line;
    }
  }

  // Permitted index variable names for array pointer tags (strictly filters out sum, total, max, etc.)
  const VALID_INDEX_POINTERS = new Set([
    'i', 'j', 'k', 'pos', 'index', 'idx', 'p', 'curr', 'cursor',
    'low', 'high', 'mid', 'min_idx', 'max_idx', 'left', 'right', 'front', 'rear'
  ]);

  // --- Pattern Printing Helper ---
  class PatternTracker {
    constructor() {
      this.grid = [];
      this.currentRow = 0;
      this.currentCol = -1;
      this.currentChar = '';
      this.loopVars = {};
    }

    printChar(ch, row, loopVars = {}) {
      while (this.grid.length <= row) {
        this.grid.push([]);
      }
      this.grid[row].push(ch);
      this.currentRow = row;
      this.currentCol = this.grid[row].length - 1;
      this.currentChar = ch;
      this.loopVars = { ...loopVars };
    }

    newLine(row) {
      while (this.grid.length <= row + 1) {
        this.grid.push([]);
      }
      this.currentRow = row + 1;
      this.currentCol = -1;
      this.currentChar = '\n';
    }

    getSnapshot() {
      return {
        type: 'pattern',
        grid: this.grid.map(r => [...r]),
        currentRow: this.currentRow,
        currentCol: this.currentCol,
        currentChar: this.currentChar,
        loopVars: { ...this.loopVars }
      };
    }
  }

  // ==========================================================================
  // 1. C ENGINE (TOKENIZER, PARSER, INTERPRETER)
  // ==========================================================================

  const C_TOKEN_SPEC = [
    { type: 'PREPROCESSOR', regex: /^#[^\n]*/ },
    { type: 'COMMENT_SINGLE', regex: /^\/\/[^\n]*/ },
    { type: 'COMMENT_MULTI', regex: /^\/\*[\s\S]*?\*\// },
    { type: 'STRING', regex: /^"([^"\\]|\\.)*"/ },
    { type: 'ARROW', regex: /^->/ },
    { type: 'INC', regex: /^\+\+/ },
    { type: 'DEC', regex: /^--/ },
    { type: 'ADD_ASSIGN', regex: /^\+=/ },
    { type: 'SUB_ASSIGN', regex: /^-=/ },
    { type: 'MUL_ASSIGN', regex: /^\*=/ },
    { type: 'DIV_ASSIGN', regex: /^\/=/ },
    { type: 'EQ', regex: /^==/ },
    { type: 'NE', regex: /^!=/ },
    { type: 'LE', regex: /^<=/ },
    { type: 'GE', regex: /^>=/ },
    { type: 'AND', regex: /^&&/ },
    { type: 'OR', regex: /^\|\|/ },
    { type: 'ASSIGN', regex: /^=/ },
    { type: 'LT', regex: /^</ },
    { type: 'GT', regex: /^>/ },
    { type: 'PLUS', regex: /^\+/ },
    { type: 'MINUS', regex: /^-/ },
    { type: 'MUL', regex: /^\*/ },
    { type: 'DIV', regex: /^\// },
    { type: 'MOD', regex: /^%/ },
    { type: 'NOT', regex: /^!/ },
    { type: 'AMP', regex: /^&/ },
    { type: 'SEMICOLON', regex: /^;/ },
    { type: 'COMMA', regex: /^,/ },
    { type: 'LPAREN', regex: /^\(/ },
    { type: 'RPAREN', regex: /^\)/ },
    { type: 'LBRACKET', regex: /^\[/ },
    { type: 'RBRACKET', regex: /^\]/ },
    { type: 'LBRACE', regex: /^\{/ },
    { type: 'RBRACE', regex: /^\}/ },
    { type: 'DOT', regex: /^\./ },
    { type: 'NUMBER', regex: /^\d+/ },
    { type: 'IDENT', regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ },
    { type: 'NEWLINE', regex: /^\n/ },
    { type: 'SKIP', regex: /^[ \t\r]+/ }
  ];

  const C_KEYWORDS = new Set([
    'int', 'void', 'char', 'float', 'double', 'struct', 'sizeof', 'malloc', 'free',
    'NULL', 'return', 'if', 'else', 'for', 'while', 'break', 'continue', 'typedef', 'printf'
  ]);

  function tokenizeC(code) {
    const tokens = [];
    let lineNum = 1;
    let index = 0;

    while (index < code.length) {
      const rest = code.slice(index);
      let matched = false;

      for (const { type, regex } of C_TOKEN_SPEC) {
        const m = regex.exec(rest);
        if (m) {
          const val = m[0];
          index += val.length;
          matched = true;

          if (type === 'NEWLINE') {
            lineNum++;
          } else if (type === 'SKIP') {
            // whitespace
          } else if (type === 'COMMENT_SINGLE' || type === 'PREPROCESSOR') {
            lineNum += (val.match(/\n/g) || []).length;
          } else if (type === 'COMMENT_MULTI') {
            lineNum += (val.match(/\n/g) || []).length;
          } else {
            let tokType = type;
            if (tokType === 'IDENT' && C_KEYWORDS.has(val)) {
              tokType = val.toUpperCase();
            }
            tokens.push({ type: tokType, val, line: lineNum });
          }
          break;
        }
      }

      if (!matched) {
        throw new ParseError(`Unrecognized character '${rest[0]}'`, lineNum);
      }
    }

    tokens.push({ type: 'EOF', val: '', line: lineNum });
    return tokens;
  }

  // --- C AST Parser ---
  class CParser {
    constructor(tokens) {
      this.tokens = tokens;
      this.pos = 0;
    }

    cur() { return this.tokens[this.pos]; }
    peek(offset = 1) { return this.tokens[this.pos + offset] || this.tokens[this.tokens.length - 1]; }
    match(...types) { return types.includes(this.cur().type); }
    eat(type) {
      const tok = this.cur();
      if (type && tok.type !== type) {
        throw new ParseError(`Expected '${type}' but found '${tok.val || tok.type}'`, tok.line);
      }
      this.pos++;
      return tok;
    }

    parse() {
      const program = { type: 'Program', structs: [], functions: [] };
      while (!this.match('EOF')) {
        if (this.match('STRUCT') && this.peek().type === 'IDENT' && this.peek(2).type === 'LBRACE') {
          program.structs.push(this.parseStructDef());
        } else if (this.match('TYPEDEF')) {
          this.skipUntil('SEMICOLON');
          this.eat('SEMICOLON');
        } else {
          program.functions.push(this.parseFunction());
        }
      }
      return program;
    }

    skipUntil(type) {
      while (!this.match('EOF') && !this.match(type)) {
        this.eat();
      }
    }

    parseStructDef() {
      const line = this.cur().line;
      this.eat('STRUCT');
      const name = this.eat('IDENT').val;
      this.eat('LBRACE');
      const members = [];
      while (!this.match('RBRACE') && !this.match('EOF')) {
        const mType = this.parseType();
        const mName = this.eat('IDENT').val;
        this.eat('SEMICOLON');
        members.push({ type: mType, name: mName });
      }
      this.eat('RBRACE');
      this.eat('SEMICOLON');
      return { type: 'StructDef', name, members, line };
    }

    parseType() {
      let isStruct = false;
      let base = '';
      if (this.match('STRUCT')) {
        this.eat('STRUCT');
        isStruct = true;
        base = this.eat('IDENT').val;
      } else if (this.match('INT', 'VOID', 'CHAR', 'FLOAT', 'DOUBLE')) {
        base = this.eat().val;
      } else if (this.match('IDENT')) {
        base = this.eat('IDENT').val;
      } else {
        throw new ParseError(`Expected type specifier, got '${this.cur().val}'`, this.cur().line);
      }
      let ptrDepth = 0;
      while (this.match('MUL')) {
        this.eat('MUL');
        ptrDepth++;
      }
      return { base, isStruct, ptrDepth };
    }

    parseFunction() {
      const line = this.cur().line;
      const retType = this.parseType();
      const name = this.eat('IDENT').val;
      this.eat('LPAREN');
      const params = [];
      while (!this.match('RPAREN') && !this.match('EOF')) {
        if (this.match('VOID') && this.peek().type === 'RPAREN') {
          this.eat('VOID');
          break;
        }
        const pType = this.parseType();
        let pName = '';
        if (this.match('IDENT')) pName = this.eat('IDENT').val;
        params.push({ type: pType, name: pName });
        if (this.match('COMMA')) this.eat('COMMA');
      }
      this.eat('RPAREN');
      const body = this.parseCompoundStmt();
      return { type: 'Function', name, retType, params, body, line };
    }

    parseCompoundStmt() {
      const line = this.cur().line;
      this.eat('LBRACE');
      const statements = [];
      while (!this.match('RBRACE') && !this.match('EOF')) {
        statements.push(this.parseStatement());
      }
      this.eat('RBRACE');
      return { type: 'CompoundStmt', statements, line };
    }

    parseStatement() {
      const line = this.cur().line;
      if (this.match('LBRACE')) return this.parseCompoundStmt();
      if (this.match('INT', 'CHAR', 'STRUCT') || (this.match('IDENT') && this.isTypeAhead())) {
        return this.parseVarDecl();
      }
      if (this.match('FOR')) return this.parseFor();
      if (this.match('WHILE')) return this.parseWhile();
      if (this.match('IF')) return this.parseIf();
      if (this.match('RETURN')) {
        this.eat('RETURN');
        let expr = null;
        if (!this.match('SEMICOLON')) expr = this.parseExpr();
        this.eat('SEMICOLON');
        return { type: 'ReturnStmt', expr, line };
      }
      if (this.match('BREAK')) {
        this.eat('BREAK');
        this.eat('SEMICOLON');
        return { type: 'BreakStmt', line };
      }
      if (this.match('CONTINUE')) {
        this.eat('CONTINUE');
        this.eat('SEMICOLON');
        return { type: 'ContinueStmt', line };
      }

      const expr = this.parseExpr();
      this.eat('SEMICOLON');
      return { type: 'ExprStmt', expr, line };
    }

    isTypeAhead() {
      const next = this.peek();
      return next.type === 'MUL' || next.type === 'IDENT';
    }

    parseVarDecl() {
      const line = this.cur().line;
      const varType = this.parseType();
      const name = this.eat('IDENT').val;

      // Array declaration e.g. int arr[5] = {1, 2, 3}; or int arr[] = {1, 2};
      if (this.match('LBRACKET')) {
        this.eat('LBRACKET');
        let capacity = null;
        if (!this.match('RBRACKET')) {
          capacity = this.eat('NUMBER').val;
        }
        this.eat('RBRACKET');
        let initElements = null;
        if (this.match('ASSIGN')) {
          this.eat('ASSIGN');
          this.eat('LBRACE');
          initElements = [];
          while (!this.match('RBRACE') && !this.match('EOF')) {
            initElements.push(this.parseExpr());
            if (this.match('COMMA')) this.eat('COMMA');
          }
          this.eat('RBRACE');
        }
        this.eat('SEMICOLON');
        return {
          type: 'ArrayDecl',
          varType,
          name,
          capacity: capacity ? parseInt(capacity, 10) : (initElements ? initElements.length : 0),
          initElements,
          line
        };
      }

      let initExpr = null;
      if (this.match('ASSIGN')) {
        this.eat('ASSIGN');
        initExpr = this.parseExpr();
      }
      this.eat('SEMICOLON');
      return { type: 'VarDecl', varType, name, initExpr, line };
    }

    parseFor() {
      const line = this.cur().line;
      this.eat('FOR');
      this.eat('LPAREN');
      let init = null;
      if (!this.match('SEMICOLON')) {
        if (this.match('INT', 'CHAR', 'STRUCT')) init = this.parseVarDecl();
        else {
          init = { type: 'ExprStmt', expr: this.parseExpr(), line: this.cur().line };
          this.eat('SEMICOLON');
        }
      } else {
        this.eat('SEMICOLON');
      }

      let test = null;
      if (!this.match('SEMICOLON')) test = this.parseExpr();
      this.eat('SEMICOLON');

      let update = null;
      if (!this.match('RPAREN')) update = this.parseExpr();
      this.eat('RPAREN');

      const body = this.parseStatement();
      return { type: 'ForStmt', init, test, update, body, line };
    }

    parseWhile() {
      const line = this.cur().line;
      this.eat('WHILE');
      this.eat('LPAREN');
      const test = this.parseExpr();
      this.eat('RPAREN');
      const body = this.parseStatement();
      return { type: 'WhileStmt', test, body, line };
    }

    parseIf() {
      const line = this.cur().line;
      this.eat('IF');
      this.eat('LPAREN');
      const test = this.parseExpr();
      this.eat('RPAREN');
      const consequent = this.parseStatement();
      let alternate = null;
      if (this.match('ELSE')) {
        this.eat('ELSE');
        alternate = this.parseStatement();
      }
      return { type: 'IfStmt', test, consequent, alternate, line };
    }

    parseExpr() {
      return this.parseAssignment();
    }

    parseAssignment() {
      const left = this.parseLogicalOr();
      if (this.match('ASSIGN', 'ADD_ASSIGN', 'SUB_ASSIGN', 'MUL_ASSIGN', 'DIV_ASSIGN')) {
        const op = this.eat().val;
        const right = this.parseAssignment();
        return { type: 'Assignment', left, op, right, line: left.line };
      }
      return left;
    }

    parseLogicalOr() {
      let left = this.parseLogicalAnd();
      while (this.match('OR')) {
        const op = this.eat().val;
        const right = this.parseLogicalAnd();
        left = { type: 'BinaryOp', left, op, right, line: left.line };
      }
      return left;
    }

    parseLogicalAnd() {
      let left = this.parseEquality();
      while (this.match('AND')) {
        const op = this.eat().val;
        const right = this.parseEquality();
        left = { type: 'BinaryOp', left, op, right, line: left.line };
      }
      return left;
    }

    parseEquality() {
      let left = this.parseRelational();
      while (this.match('EQ', 'NE')) {
        const op = this.eat().val;
        const right = this.parseRelational();
        left = { type: 'BinaryOp', left, op, right, line: left.line };
      }
      return left;
    }

    parseRelational() {
      let left = this.parseAdditive();
      while (this.match('LT', 'GT', 'LE', 'GE')) {
        const op = this.eat().val;
        const right = this.parseAdditive();
        left = { type: 'BinaryOp', left, op, right, line: left.line };
      }
      return left;
    }

    parseAdditive() {
      let left = this.parseMultiplicative();
      while (this.match('PLUS', 'MINUS')) {
        const op = this.eat().val;
        const right = this.parseMultiplicative();
        left = { type: 'BinaryOp', left, op, right, line: left.line };
      }
      return left;
    }

    parseMultiplicative() {
      let left = this.parseUnary();
      while (this.match('MUL', 'DIV', 'MOD')) {
        const op = this.eat().val;
        const right = this.parseUnary();
        left = { type: 'BinaryOp', left, op, right, line: left.line };
      }
      return left;
    }

    parseUnary() {
      const line = this.cur().line;
      if (this.match('MINUS', 'PLUS', 'NOT')) {
        const op = this.eat().val;
        const operand = this.parseUnary();
        return { type: 'UnaryOp', op, operand, line };
      }
      if (this.match('INC', 'DEC')) {
        const op = this.eat().type;
        const operand = this.parsePostfix();
        return { type: 'IncDec', target: operand, op, isPrefix: true, line };
      }
      if (this.match('LPAREN') && (this.peek().type === 'STRUCT' || this.peek().type === 'IDENT')) {
        this.eat('LPAREN');
        const castType = this.parseType();
        this.eat('RPAREN');
        const expr = this.parseUnary();
        if (expr.type === 'MallocExpr') {
          expr.castType = castType;
          return expr;
        }
        return expr;
      }
      return this.parsePostfix();
    }

    parsePostfix() {
      let expr = this.parsePrimary();
      while (true) {
        const line = this.cur().line;
        if (this.match('LBRACKET')) {
          this.eat('LBRACKET');
          const idx = this.parseExpr();
          this.eat('RBRACKET');
          expr = { type: 'ArrayAccess', array: expr, index: idx, line };
        } else if (this.match('ARROW')) {
          this.eat('ARROW');
          const member = this.eat('IDENT').val;
          expr = { type: 'MemberAccess', target: expr, member, op: '->', line };
        } else if (this.match('DOT')) {
          this.eat('DOT');
          const member = this.eat('IDENT').val;
          expr = { type: 'MemberAccess', target: expr, member, op: '.', line };
        } else if (this.match('INC', 'DEC')) {
          const op = this.eat().type;
          expr = { type: 'IncDec', target: expr, op, isPrefix: false, line };
        } else {
          break;
        }
      }
      return expr;
    }

    parsePrimary() {
      const tok = this.cur();
      const line = tok.line;

      if (this.match('NUMBER')) {
        this.eat('NUMBER');
        return { type: 'Literal', val: parseInt(tok.val, 10), raw: tok.val, line };
      }
      if (this.match('STRING')) {
        this.eat('STRING');
        return { type: 'Literal', val: tok.val.slice(1, -1), raw: tok.val, line };
      }
      if (this.match('NULL')) {
        this.eat('NULL');
        return { type: 'NullLiteral', val: null, line };
      }
      if (this.match('MALLOC')) {
        this.eat('MALLOC');
        this.eat('LPAREN');
        let depth = 1;
        while (!this.match('EOF') && depth > 0) {
          if (this.match('LPAREN')) depth++;
          else if (this.match('RPAREN')) {
            depth--;
            if (depth === 0) break;
          }
          this.eat();
        }
        this.eat('RPAREN');
        return { type: 'MallocExpr', line };
      }
      if (this.match('FREE')) {
        this.eat('FREE');
        this.eat('LPAREN');
        const arg = this.parseExpr();
        this.eat('RPAREN');
        return { type: 'FreeCall', arg, line };
      }
      if (this.match('PRINTF')) {
        this.eat('PRINTF');
        this.eat('LPAREN');
        const args = [];
        while (!this.match('RPAREN') && !this.match('EOF')) {
          args.push(this.parseExpr());
          if (this.match('COMMA')) this.eat('COMMA');
        }
        this.eat('RPAREN');
        return { type: 'Call', funcName: 'printf', args, line };
      }
      if (this.match('IDENT')) {
        const idName = this.eat('IDENT').val;
        if (this.match('LPAREN')) {
          this.eat('LPAREN');
          const args = [];
          while (!this.match('RPAREN') && !this.match('EOF')) {
            args.push(this.parseExpr());
            if (this.match('COMMA')) this.eat('COMMA');
          }
          this.eat('RPAREN');
          return { type: 'Call', funcName: idName, args, line };
        }
        return { type: 'Identifier', name: idName, line };
      }
      if (this.match('LPAREN')) {
        this.eat('LPAREN');
        const expr = this.parseExpr();
        this.eat('RPAREN');
        return expr;
      }

      throw new ParseError(`Unexpected token '${tok.val || tok.type}' in expression`, line);
    }
  }

  // --- C Interpreter ---
  class CInterpreter {
    constructor(ast) {
      this.ast = ast;
      this.variables = {};
      this.heap = {};
      this.nextHeapAddr = 0x1010;
      this.nodeIdCounter = 1;
      this.treeRoot = null;
      this.trace = [];
      this.stdout = [];
      this.stepsCount = 0;
      this.maxSteps = 800;
      // Auto-detect BST if program defines and uses a tree struct
      const hasTreeStruct = this.ast && this.ast.structs && this.ast.structs.some(s =>
        s.name === 'TreeNode' || (s.members && s.members.some(m => m.name === 'left' || m.name === 'right'))
      );
      const mainFunc = this.ast && this.ast.functions && this.ast.functions.find(f => f.name === 'main');
      const usesTree = mainFunc && (JSON.stringify(mainFunc.body).includes('TreeNode') || JSON.stringify(mainFunc.body).includes('root'));
      if (hasTreeStruct && usesTree) {
        this.detectedDsType = 'bst';
      }
      this.lastComparison = null;
      this.lastSwap = null;
      this.patternTracker = new PatternTracker();
      this.isPatternMode = false;
    }

    allocateNode(type = 'Node') {
      const id = `node_${this.nodeIdCounter++}`;
      const addr = `0x${this.nextHeapAddr.toString(16).toUpperCase()}`;
      this.nextHeapAddr += 16;
      const node = { id, addr, data: 0, val: 0, type };
      if (type === 'TreeNode' || this.detectedDsType === 'bst' || 'root' in this.variables) {
        node.left = null;
        node.right = null;
      } else {
        node.next = null;
      }
      this.heap[id] = node;
      return id;
    }

    getDsType() {
      if (this.isPatternMode) return 'pattern';
      if (this.detectedDsType) return this.detectedDsType;
      if ('root' in this.variables || Object.values(this.heap).some(n => n.left !== undefined || n.right !== undefined)) return 'bst';
      if ('head' in this.variables || Object.values(this.heap).some(n => n.next !== undefined)) return 'linked_list';
      if ('stack' in this.variables || 'top' in this.variables) return 'stack';
      if ('queue' in this.variables || ('front' in this.variables && 'rear' in this.variables)) return 'queue';
      if (this.lastComparison || 'target' in this.variables || 'foundIndex' in this.variables) return 'searching_sorting';
      return 'array';
    }

    captureMemoryState(highlights = {}) {
      const dsType = this.getDsType();

      if (dsType === 'pattern') {
        return this.patternTracker.getSnapshot();
      }

      // Filter array pointers to VALID_INDEX_POINTERS only (never sum, total, max, etc.)
      const arrayPointers = {};
      for (const [k, v] of Object.entries(this.variables)) {
        if (VALID_INDEX_POINTERS.has(k) && typeof v === 'number') {
          arrayPointers[k] = v;
        }
      }

      if (dsType === 'bst') {
        const rootId = this.variables.root || this.treeRoot;
        const nodesList = [];
        const visited = new Set();
        const traverse = (nid) => {
          if (!nid || !this.heap[nid] || visited.has(nid)) return;
          visited.add(nid);
          const node = this.heap[nid];
          nodesList.push({ id: node.id, addr: node.addr, val: node.val || node.data, left: node.left, right: node.right });
          traverse(node.left);
          traverse(node.right);
        };
        if (rootId) traverse(rootId);
        for (const [nid, node] of Object.entries(this.heap)) {
          if (!visited.has(nid) && (node.left !== undefined || node.right !== undefined)) {
            nodesList.push({ id: node.id, addr: node.addr, val: node.val || node.data, left: node.left, right: node.right });
          }
        }
        return {
          type: 'bst',
          root: rootId,
          nodes: nodesList,
          pointers: { ...this.variables },
          highlight_nodes: {
            accessed: highlights.accessedNodes || [],
            modified: highlights.modifiedNodes || [],
            created: highlights.createdNodes || [],
            compared: highlights.comparedNodes || []
          }
        };
      }

      if (dsType === 'stack') {
        const arrObj = this.variables.stack || Object.values(this.variables).find(v => v && v.type === 'ArrayObject') || { capacity: 5, elements: [] };
        const top = typeof this.variables.top === 'number' ? this.variables.top : -1;
        return {
          type: 'stack',
          name: 'stack',
          capacity: arrObj.capacity,
          top,
          elements: arrObj.elements ? arrObj.elements.slice(0, arrObj.capacity) : [],
          highlight_indices: {
            accessed: highlights.accessedIndices || [],
            modified: highlights.modifiedIndices || [],
            pointers: arrayPointers
          },
          is_overflow: top >= arrObj.capacity,
          is_underflow: top < -1
        };
      }

      if (dsType === 'queue') {
        const arrObj = this.variables.queue || Object.values(this.variables).find(v => v && v.type === 'ArrayObject') || { capacity: 5, elements: [] };
        const front = typeof this.variables.front === 'number' ? this.variables.front : 0;
        const rear = typeof this.variables.rear === 'number' ? this.variables.rear : 0;
        return {
          type: 'queue',
          name: 'queue',
          capacity: arrObj.capacity,
          front,
          rear,
          elements: arrObj.elements ? arrObj.elements.slice(0, arrObj.capacity) : [],
          highlight_indices: {
            accessed: highlights.accessedIndices || [],
            modified: highlights.modifiedIndices || [],
            pointers: arrayPointers
          },
          is_overflow: rear >= arrObj.capacity,
          is_underflow: front > rear
        };
      }

      if (dsType === 'linked_list') {
        const headId = this.variables.head || null;
        const nodesList = [];
        const visited = new Set();
        let curr = headId;
        while (curr && this.heap[curr] && !visited.has(curr)) {
          visited.add(curr);
          const n = this.heap[curr];
          nodesList.push({ id: n.id, addr: n.addr, data: n.data !== undefined ? n.data : n.val, next: n.next });
          curr = n.next;
        }
        for (const [nid, n] of Object.entries(this.heap)) {
          if (!visited.has(nid) && n.next !== undefined) {
            nodesList.push({ id: n.id, addr: n.addr, data: n.data !== undefined ? n.data : n.val, next: n.next });
          }
        }
        const pointers = {};
        for (const [k, v] of Object.entries(this.variables)) {
          if (v === null || (typeof v === 'string' && (v in this.heap || v === 'NULL'))) {
            pointers[k] = v;
          }
        }
        return {
          type: 'linked_list',
          head: headId,
          nodes: nodesList,
          pointers,
          highlight_nodes: {
            accessed: highlights.accessedNodes || [],
            modified: highlights.modifiedNodes || [],
            created: highlights.createdNodes || [],
            deleted: highlights.deletedNodes || []
          }
        };
      }

      // Default: Array or Searching/Sorting or Multiplication Table
      let arrObj = Object.values(this.variables).find(v => v && v.type === 'ArrayObject');

      // Check for Multiplication Table pattern (either array named 'table' or scalar loop with num)
      const isMultTable = (arrObj && arrObj.name === 'table') ||
        (this.variables.num !== undefined && (this.variables.prod !== undefined || this.variables.i !== undefined || !arrObj));

      if (isMultTable) {
        const num = this.variables.num !== undefined ? this.variables.num : 5;
        const currentI = typeof this.variables.i === 'number' ? this.variables.i : 1;
        const currentProd = typeof this.variables.prod === 'number' ? this.variables.prod : (num * currentI);

        if (arrObj) {
          return {
            type: 'multiplication_table',
            name: arrObj.name,
            num,
            i: currentI,
            prod: currentProd,
            capacity: arrObj.capacity,
            length: arrObj.elements.length,
            elements: arrObj.elements.slice(0, arrObj.capacity),
            highlight_indices: {
              accessed: highlights.accessedIndices || [],
              modified: highlights.modifiedIndices || (currentI >= 1 ? [currentI - 1] : []),
              compared: [],
              swapped: [],
              pointers: arrayPointers
            }
          };
        } else {
          const limit = Math.max(currentI <= 6 ? 6 : currentI, 6);
          const syntheticElements = [];
          for (let idx = 1; idx <= limit; idx++) {
            syntheticElements.push(idx <= currentI ? num * idx : 0);
          }
          return {
            type: 'multiplication_table',
            name: 'table',
            num,
            i: currentI,
            prod: currentProd,
            capacity: limit,
            length: currentI,
            elements: syntheticElements,
            highlight_indices: {
              accessed: [],
              modified: currentI >= 1 ? [currentI - 1] : [],
              compared: [],
              swapped: [],
              pointers: { i: currentI }
            }
          };
        }
      }

      if (!arrObj) {
        arrObj = { name: 'arr', capacity: 0, elements: [] };
      }

      let length = arrObj.elements.length;
      for (const lenName of ['n', 'size', 'len', 'count']) {
        if (typeof this.variables[lenName] === 'number') {
          length = this.variables[lenName];
          break;
        }
      }

      return {
        type: dsType === 'searching_sorting' ? 'searching_sorting' : 'array',
        name: arrObj.name || 'arr',
        capacity: arrObj.capacity,
        length,
        elements: arrObj.elements.slice(0, arrObj.capacity),
        target: this.variables.target !== undefined ? this.variables.target : null,
        foundIndex: this.variables.foundIndex !== undefined ? this.variables.foundIndex : null,
        comparison: this.lastComparison,
        swap: this.lastSwap,
        highlight_indices: {
          accessed: highlights.accessedIndices || [],
          modified: highlights.modifiedIndices || [],
          compared: highlights.comparedIndices || [],
          swapped: highlights.swappedIndices || [],
          pointers: arrayPointers
        }
      };
    }

    emitStep(line, operation, explanation, highlights = {}) {
      if (this.stepsCount >= this.maxSteps) {
        throw new RuntimeErrorEx(`Execution limit exceeded (${this.maxSteps} steps). Possible infinite loop.`, line);
      }

      const memState = this.captureMemoryState(highlights);
      const varSnapshot = {};
      for (const [k, v] of Object.entries(this.variables)) {
        if (v && v.type === 'ArrayObject') {
          varSnapshot[k] = [...v.elements];
        } else {
          varSnapshot[k] = v;
        }
      }

      const record = {
        step_id: ++this.stepsCount,
        line_number: line,
        operation,
        explanation,
        ds_type: this.getDsType(),
        variables: varSnapshot,
        memory_state: memState,
        stdout: this.stdout.join('')
      };

      this.trace.push(record);
    }

    run() {
      const mainFunc = this.ast.functions.find(f => f.name === 'main');
      if (!mainFunc) {
        throw new ParseError("C program must define a 'main()' function.", 1);
      }
      this.executeCompound(mainFunc.body);
      return this.trace;
    }

    executeCompound(compound) {
      for (const stmt of compound.statements) {
        const ret = this.executeStmt(stmt);
        if (ret && ret.isReturn) return ret;
      }
    }

    executeStmt(stmt) {
      if (!stmt) return;
      const line = stmt.line;

      switch (stmt.type) {
        case 'CompoundStmt':
          return this.executeCompound(stmt);

        case 'VarDecl': {
          let initVal = 0;
          if (stmt.initExpr) initVal = this.evalExpr(stmt.initExpr, line);
          this.variables[stmt.name] = initVal;
          this.emitStep(line, 'var_decl', `Declared variable '${stmt.name}' = ${initVal}.`);
          break;
        }

        case 'ArrayDecl': {
          const cap = stmt.capacity;
          const elems = new Array(cap).fill(0);
          if (stmt.initElements) {
            stmt.initElements.forEach((e, i) => {
              elems[i] = this.evalExpr(e, line);
            });
          }
          this.variables[stmt.name] = { type: 'ArrayObject', name: stmt.name, capacity: cap, elements: elems };
          this.emitStep(line, 'array_init', `Initialized array '${stmt.name}[${cap}]' with values: [${elems.join(', ')}].`, { modifiedIndices: elems.map((_, i) => i) });
          break;
        }

        case 'ExprStmt':
          this.evalExpr(stmt.expr, line);
          break;

        case 'ForStmt': {
          if (stmt.init) this.executeStmt(stmt.init);
          while (true) {
            if (stmt.test) {
              const cond = this.evalExpr(stmt.test, stmt.line);
              if (!cond) break;
            }
            const res = this.executeStmt(stmt.body);
            if (res && res.isReturn) return res;
            if (res && res.isBreak) break;
            if (stmt.update) this.evalExpr(stmt.update, stmt.line);
          }
          break;
        }

        case 'WhileStmt': {
          while (true) {
            const cond = this.evalExpr(stmt.test, stmt.line);
            if (!cond) break;
            const res = this.executeStmt(stmt.body);
            if (res && res.isReturn) return res;
            if (res && res.isBreak) break;
          }
          break;
        }

        case 'IfStmt': {
          const cond = this.evalExpr(stmt.test, stmt.line);
          if (cond) {
            const res = this.executeStmt(stmt.consequent);
            if (res) return res;
          } else if (stmt.alternate) {
            const res = this.executeStmt(stmt.alternate);
            if (res) return res;
          }
          break;
        }

        case 'ReturnStmt': {
          let retVal = 0;
          if (stmt.expr) retVal = this.evalExpr(stmt.expr, line);
          this.emitStep(line, 'return', `Function main() returned ${retVal}. Execution complete.`);
          return { isReturn: true, val: retVal };
        }

        case 'BreakStmt':
          return { isBreak: true };
      }
    }

    evalExpr(expr, line) {
      if (!expr) return 0;

      switch (expr.type) {
        case 'Literal': return expr.val;
        case 'NullLiteral': return null;

        case 'Identifier': {
          if (expr.name in this.variables) return this.variables[expr.name];
          throw new RuntimeErrorEx(`Undefined variable '${expr.name}'`, line);
        }

        case 'ArrayAccess': {
          const arrVal = this.evalExpr(expr.array, line);
          const idxVal = this.evalExpr(expr.index, line);
          if (!arrVal || !arrVal.elements) throw new RuntimeErrorEx(`Subscripted value is not an array`, line);
          if (idxVal < 0 || idxVal >= arrVal.capacity) {
            throw new RuntimeErrorEx(`Array index out of bounds: [${idxVal}] (Capacity: ${arrVal.capacity})`, line);
          }
          const val = arrVal.elements[idxVal];
          this.emitStep(line, 'array_read', `Read ${arrVal.name}[${idxVal}] = ${val}.`, { accessedIndices: [idxVal] });
          return val;
        }

        case 'MemberAccess': {
          const target = this.evalExpr(expr.target, line);
          if (!target || !this.heap[target]) throw new RuntimeErrorEx(`Dereference of NULL / invalid pointer`, line);
          const node = this.heap[target];
          this.emitStep(line, 'node_access', `Accessed field '${expr.member}' of node at ${node.addr}.`, { accessedNodes: [target] });
          return node[expr.member];
        }

        case 'Assignment': {
          const rVal = this.evalExpr(expr.right, line);
          if (expr.left.type === 'Identifier') {
            const vName = expr.left.name;
            let finalVal = rVal;
            if (expr.op === '+=') finalVal = (this.variables[vName] || 0) + rVal;
            else if (expr.op === '-=') finalVal = (this.variables[vName] || 0) - rVal;
            this.variables[vName] = finalVal;
            this.emitStep(line, 'assign', `Assigned variable '${vName}' = ${finalVal}.`);
            return finalVal;
          }
          if (expr.left.type === 'ArrayAccess') {
            const arrVal = this.evalExpr(expr.left.array, line);
            const idxVal = this.evalExpr(expr.left.index, line);
            arrVal.elements[idxVal] = rVal;
            this.emitStep(line, 'array_write', `Updated ${arrVal.name}[${idxVal}] = ${rVal}.`, { modifiedIndices: [idxVal] });
            return rVal;
          }
          if (expr.left.type === 'MemberAccess') {
            const target = this.evalExpr(expr.left.target, line);
            const node = this.heap[target];
            node[expr.left.member] = rVal;
            this.emitStep(line, 'pointer_update', `Updated ${node.addr}->${expr.left.member} = ${rVal}.`, { modifiedNodes: [target] });
            return rVal;
          }
          break;
        }

        case 'BinaryOp': {
          const leftVal = this.evalExpr(expr.left, line);
          const rightVal = this.evalExpr(expr.right, line);

          if (['>', '<', '>=', '<=', '==', '!='].includes(expr.op) && expr.left.type === 'ArrayAccess' && expr.right.type === 'ArrayAccess') {
            const idx1 = this.evalExpr(expr.left.index, line);
            const idx2 = this.evalExpr(expr.right.index, line);
            let res = false;
            if (expr.op === '>') res = leftVal > rightVal;
            if (expr.op === '<') res = leftVal < rightVal;
            this.lastComparison = { idx1, idx2, val1: leftVal, val2: rightVal, op: expr.op, result: res };
            this.emitStep(line, 'compare', `Compared arr[${idx1}] (${leftVal}) ${expr.op} arr[${idx2}] (${rightVal}) -> ${res ? 'TRUE' : 'FALSE'}.`, { comparedIndices: [idx1, idx2] });
            return res ? 1 : 0;
          }

          switch (expr.op) {
            case '+': return leftVal + rightVal;
            case '-': return leftVal - rightVal;
            case '*': return leftVal * rightVal;
            case '/': return rightVal !== 0 ? Math.floor(leftVal / rightVal) : 0;
            case '%': return rightVal !== 0 ? leftVal % rightVal : 0;
            case '==': return leftVal === rightVal ? 1 : 0;
            case '!=': return leftVal !== rightVal ? 1 : 0;
            case '<': return leftVal < rightVal ? 1 : 0;
            case '<=': return leftVal <= rightVal ? 1 : 0;
            case '>': return leftVal > rightVal ? 1 : 0;
            case '>=': return leftVal >= rightVal ? 1 : 0;
          }
          return 0;
        }

        case 'IncDec': {
          if (expr.target.type === 'Identifier') {
            const vName = expr.target.name;
            const oldVal = this.variables[vName] || 0;
            const newVal = expr.op === 'INC' ? oldVal + 1 : oldVal - 1;
            this.variables[vName] = newVal;
            return expr.isPrefix ? newVal : oldVal;
          }
          break;
        }

        case 'MallocExpr': {
          const isTree = this.detectedDsType === 'bst' || ('root' in this.variables) ||
            (expr.castType && (expr.castType.name === 'TreeNode' || expr.castType.name === 'struct TreeNode'));
          const nid = this.allocateNode(isTree ? 'TreeNode' : 'Node');
          const node = this.heap[nid];
          this.emitStep(line, 'allocate_node', `malloc(): Allocated node at address ${node.addr} (id: ${nid}).`, { createdNodes: [nid] });
          return nid;
        }

        case 'FreeCall': {
          const targetId = this.evalExpr(expr.arg, line);
          if (targetId && this.heap[targetId]) {
            const node = this.heap[targetId];
            this.emitStep(line, 'free_node', `free(): Deallocated node at ${node.addr}.`, { deletedNodes: [targetId] });
            delete this.heap[targetId];
          }
          return 0;
        }

        case 'Call': {
          if (expr.funcName === 'printf') {
            const argsVal = expr.args.map(a => this.evalExpr(a, line));
            if (argsVal.length > 0) {
              const fmt = String(argsVal[0]);
              let out = fmt;
              if (argsVal.length > 1) {
                let argIdx = 1;
                out = fmt.replace(/%[difs]/g, () => (argIdx < argsVal.length ? argsVal[argIdx++] : ''));
              }
              this.stdout.push(out);

              // Check if pattern printing
              if (out.includes('\n')) {
                this.isPatternMode = true;
                const r = this.variables.i !== undefined ? this.variables.i : this.patternTracker.currentRow;
                this.patternTracker.newLine(r);
                this.emitStep(line, 'pattern_newline', `printf("\\n"): Advanced to next line.`);
              } else {
                this.isPatternMode = true;
                const r = this.variables.i !== undefined ? this.variables.i : 0;
                for (const ch of out) {
                  this.patternTracker.printChar(ch, r, { i: this.variables.i, j: this.variables.j });
                }
                this.emitStep(line, 'pattern_print', `printf(): Printed '${out}' in Row ${r}.`);
              }
            }
            return 0;
          }
          break;
        }
      }
      return 0;
    }
  }

  // ==========================================================================
  // 2. PYTHON 3 ENGINE (PARSER & TRACING INTERPRETER)
  // ==========================================================================

  function parsePyBlocks(lines) {
    const root = [];
    const stack = [{ indent: -1, body: root }];

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const indent = raw.search(/\S/);

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }

      const currentParent = stack[stack.length - 1].body;
      const lineNum = i + 1;

      // For statement
      const forMatch = /^for\s+([a-zA-Z_]\w*)\s+in\s+(?:range\((.*?)\)|([a-zA-Z_]\w*))\s*:/.exec(trimmed);
      if (forMatch) {
        const node = {
          type: 'for',
          varName: forMatch[1],
          rangeStr: forMatch[2] !== undefined ? forMatch[2] : null,
          iterList: forMatch[3] || null,
          body: [],
          lineNum
        };
        currentParent.push(node);
        stack.push({ indent, body: node.body });
        continue;
      }

      // While statement
      const whileMatch = /^while\s+(.*?)\s*:/.exec(trimmed);
      if (whileMatch) {
        const node = { type: 'while', cond: whileMatch[1], body: [], lineNum };
        currentParent.push(node);
        stack.push({ indent, body: node.body });
        continue;
      }

      // If statement
      const ifMatch = /^if\s+(.*?)\s*:/.exec(trimmed);
      if (ifMatch) {
        const node = { type: 'if', cond: ifMatch[1], body: [], elseBody: [], lineNum };
        currentParent.push(node);
        stack.push({ indent, body: node.body });
        continue;
      }

      // Else statement
      const elseMatch = /^else\s*:/.exec(trimmed);
      if (elseMatch) {
        const prevNode = currentParent[currentParent.length - 1];
        if (prevNode && prevNode.type === 'if') {
          stack.push({ indent, body: prevNode.elseBody });
          continue;
        }
      }

      // Simple statement
      currentParent.push({ type: 'simple', text: trimmed, lineNum });
    }

    return root;
  }

  function executePython(codeStr) {
    const lines = codeStr.split('\n');
    const variables = {};
    const heap = {};
    let nodeIdCounter = 1;
    let nextAddr = 0x1010;
    const stdout = [];
    const trace = [];
    let stepCount = 0;
    let lastComparison = null;
    const patternTracker = new PatternTracker();
    let isPatternMode = false;

    function allocateNode(val) {
      const id = `node_${nodeIdCounter++}`;
      const addr = `0x${nextAddr.toString(16).toUpperCase()}`;
      nextAddr += 16;
      heap[id] = { id, addr, data: val, val, next: null, left: null, right: null };
      return id;
    }

    function emitStep(lineNum, operation, explanation, highlights = {}) {
      if (++stepCount > 800) {
        throw new RuntimeErrorEx("Execution step limit exceeded (possible infinite loop).", lineNum);
      }

      let dsType = 'array';
      if (isPatternMode) {
        dsType = 'pattern';
      } else if ('root' in variables || Object.values(heap).some(n => n.left !== null || n.right !== null)) {
        dsType = 'bst';
      } else if ('head' in variables || Object.values(heap).some(n => n.next !== null)) {
        dsType = 'linked_list';
      } else if ('stack' in variables) {
        dsType = 'stack';
      } else if ('queue' in variables) {
        dsType = 'queue';
      } else if (lastComparison || 'target' in variables || 'found_index' in variables || 'foundIndex' in variables) {
        dsType = 'searching_sorting';
      }

      let memState = null;
      if (dsType === 'pattern') {
        memState = patternTracker.getSnapshot();
      } else if (dsType === 'linked_list') {
        const headId = variables.head || null;
        const nodesList = [];
        const visited = new Set();
        let curr = headId;
        while (curr && heap[curr] && !visited.has(curr)) {
          visited.add(curr);
          const n = heap[curr];
          nodesList.push({ id: n.id, addr: n.addr, data: n.data, next: n.next });
          curr = n.next;
        }
        memState = {
          type: 'linked_list',
          head: headId,
          nodes: nodesList,
          pointers: { head: headId, curr: variables.curr || null },
          highlight_nodes: {
            accessed: highlights.accessedNodes || [],
            modified: highlights.modifiedNodes || [],
            created: highlights.createdNodes || []
          }
        };
      } else if (dsType === 'stack') {
        const stackList = Array.isArray(variables.stack) ? variables.stack : [];
        memState = {
          type: 'stack',
          name: 'stack',
          capacity: Math.max(5, stackList.length + 1),
          top: stackList.length - 1,
          elements: [...stackList],
          highlight_indices: {
            accessed: highlights.accessedIndices || [],
            modified: highlights.modifiedIndices || []
          }
        };
      } else if (dsType === 'queue') {
        const queueList = Array.isArray(variables.queue) ? variables.queue : [];
        memState = {
          type: 'queue',
          name: 'queue',
          capacity: Math.max(5, queueList.length + 2),
          front: 0,
          rear: queueList.length,
          elements: [...queueList],
          highlight_indices: {
            accessed: highlights.accessedIndices || [],
            modified: highlights.modifiedIndices || []
          }
        };
      } else if (dsType === 'bst') {
        const rootId = variables.root || null;
        const nodesList = [];
        const visited = new Set();
        const traverse = (nid) => {
          if (!nid || !heap[nid] || visited.has(nid)) return;
          visited.add(nid);
          const n = heap[nid];
          nodesList.push({ id: n.id, addr: n.addr, val: n.val, left: n.left, right: n.right });
          traverse(n.left);
          traverse(n.right);
        };
        if (rootId) traverse(rootId);
        memState = {
          type: 'bst',
          root: rootId,
          nodes: nodesList,
          pointers: { root: rootId },
          highlight_nodes: {
            accessed: highlights.accessedNodes || [],
            modified: highlights.modifiedNodes || [],
            compared: highlights.comparedNodes || []
          }
        };
      } else {
        // Array / List
        let primaryList = null;
        let listName = 'arr';
        for (const [k, v] of Object.entries(variables)) {
          if (Array.isArray(v)) {
            primaryList = v;
            listName = k;
            break;
          }
        }
        if (!primaryList) primaryList = [];

        // Filter array pointers to VALID_INDEX_POINTERS only
        const pointers = {};
        for (const [k, v] of Object.entries(variables)) {
          if (VALID_INDEX_POINTERS.has(k) && typeof v === 'number') {
            pointers[k] = v;
          }
        }

        memState = {
          type: dsType === 'searching_sorting' ? 'searching_sorting' : 'array',
          name: listName,
          capacity: Math.max(primaryList.length, variables.n || 0),
          length: primaryList.length,
          elements: [...primaryList],
          target: variables.target !== undefined ? variables.target : null,
          foundIndex: variables.found_index !== undefined ? variables.found_index : (variables.foundIndex !== undefined ? variables.foundIndex : null),
          comparison: lastComparison,
          highlight_indices: {
            accessed: highlights.accessedIndices || [],
            modified: highlights.modifiedIndices || [],
            compared: highlights.comparedIndices || [],
            pointers
          }
        };
      }

      const varSnapshot = {};
      for (const [k, v] of Object.entries(variables)) {
        if (Array.isArray(v)) varSnapshot[k] = [...v];
        else varSnapshot[k] = v;
      }

      trace.push({
        step_id: stepCount,
        line_number: lineNum,
        operation,
        explanation,
        ds_type: dsType,
        variables: varSnapshot,
        memory_state: memState,
        stdout: stdout.join('')
      });
    }

    function evalPyExpr(exprStr, lineNum) {
      exprStr = exprStr.trim();
      if (!exprStr) return 0;
      if (exprStr === 'True') return true;
      if (exprStr === 'False') return false;
      if (exprStr === 'None') return null;
      if (/^-?\d+$/.test(exprStr)) return parseInt(exprStr, 10);
      if (/^["'].*["']$/.test(exprStr)) return exprStr.slice(1, -1);

      // Node instantiation
      const nodeMatch = /^(?:Node|TreeNode)\((.*)\)$/.exec(exprStr);
      if (nodeMatch) {
        const val = evalPyExpr(nodeMatch[1], lineNum);
        const nid = allocateNode(val);
        emitStep(lineNum, 'node_create', `Instantiated Node(data=${val}) at heap address ${heap[nid].addr}.`, { createdNodes: [nid] });
        return nid;
      }

      // List literal e.g. [10, 20, 30]
      if (exprStr.startsWith('[') && exprStr.endsWith(']')) {
        const inner = exprStr.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map(s => evalPyExpr(s.trim(), lineNum));
      }

      // Member access e.g. curr.data or curr.next
      const memberMatch = /^([a-zA-Z_]\w*)\.(data|val|next|left|right)$/.exec(exprStr);
      if (memberMatch) {
        const objName = memberMatch[1];
        const field = memberMatch[2];
        const nid = variables[objName];
        if (nid && heap[nid]) {
          const val = heap[nid][field];
          emitStep(lineNum, 'node_read', `Accessed ${objName}.${field} -> ${val}.`, { accessedNodes: [nid] });
          return val;
        }
        return null;
      }

      // List indexing e.g. arr[i]
      const idxMatch = /^([a-zA-Z_]\w*)\[(.*)\]$/.exec(exprStr);
      if (idxMatch) {
        const listName = idxMatch[1];
        const idx = evalPyExpr(idxMatch[2], lineNum);
        const list = variables[listName];
        if (Array.isArray(list)) {
          const val = list[idx];
          emitStep(lineNum, 'list_read', `Accessed list element ${listName}[${idx}] = ${val}.`, { accessedIndices: [idx] });
          return val;
        }
      }

      // len(arr)
      const lenMatch = /^len\(([a-zA-Z_]\w*)\)$/.exec(exprStr);
      if (lenMatch) {
        const list = variables[lenMatch[1]];
        return Array.isArray(list) ? list.length : 0;
      }

      // Binary expressions: left OP right
      const binMatch = /^(.*?)\s*(==|!=|<=|>=|<|>|\+|\-|\*|\/\/|\/|%)\s*(.*)$/.exec(exprStr);
      if (binMatch && !binMatch[1].includes('(')) {
        const left = evalPyExpr(binMatch[1], lineNum);
        const op = binMatch[2];
        const right = evalPyExpr(binMatch[3], lineNum);

        // Sorting/Searching comparison detection
        if (['>', '<', '>=', '<=', '==', '!='].includes(op) && binMatch[1].includes('[') && binMatch[3].includes('[')) {
          let res = false;
          if (op === '>') res = left > right;
          if (op === '<') res = left < right;
          if (op === '==') res = left === right;
          lastComparison = { val1: left, val2: right, op, result: res };
          emitStep(lineNum, 'compare', `Compared ${left} ${op} ${right} -> ${res ? 'TRUE' : 'FALSE'}.`);
          return res;
        }

        switch (op) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '//': return Math.floor(left / right);
          case '/': return left / right;
          case '%': return left % right;
          case '==': return left === right;
          case '!=': return left !== right;
          case '<': return left < right;
          case '<=': return left <= right;
          case '>': return left > right;
          case '>=': return left >= right;
        }
      }

      if (exprStr in variables) return variables[exprStr];
      return 0;
    }

    function executeStatementNode(node) {
      if (!node) return;

      if (node.type === 'for') {
        const varName = node.varName;
        let iterValues = [];

        if (node.rangeStr !== null) {
          const rangeArgs = node.rangeStr.split(',').map(s => evalPyExpr(s.trim(), node.lineNum));
          let start = 0, stop = 0, step = 1;
          if (rangeArgs.length === 1) {
            stop = rangeArgs[0];
          } else if (rangeArgs.length === 2) {
            start = rangeArgs[0];
            stop = rangeArgs[1];
          } else if (rangeArgs.length >= 3) {
            start = rangeArgs[0];
            stop = rangeArgs[1];
            step = rangeArgs[2];
          }
          for (let v = start; (step > 0 ? v < stop : v > stop); v += step) {
            iterValues.push(v);
          }
        } else if (node.iterList && Array.isArray(variables[node.iterList])) {
          iterValues = [...variables[node.iterList]];
        }

        for (const iterVal of iterValues) {
          variables[varName] = iterVal;
          emitStep(node.lineNum, 'loop_for', `Loop variable '${varName}' = ${iterVal}.`);
          for (const child of node.body) {
            executeStatementNode(child);
          }
        }
        return;
      }

      if (node.type === 'while') {
        let limit = 0;
        while (evalPyExpr(node.cond, node.lineNum) && ++limit < 200) {
          emitStep(node.lineNum, 'loop_while', `While condition evaluated to True.`);
          for (const child of node.body) {
            executeStatementNode(child);
          }
        }
        return;
      }

      if (node.type === 'if') {
        const condVal = evalPyExpr(node.cond, node.lineNum);
        if (condVal) {
          emitStep(node.lineNum, 'if_true', `Condition (${node.cond}) evaluated to True.`);
          for (const child of node.body) {
            executeStatementNode(child);
          }
        } else if (node.elseBody && node.elseBody.length > 0) {
          emitStep(node.lineNum, 'if_false', `Condition (${node.cond}) evaluated to False. Entering else block.`);
          for (const child of node.elseBody) {
            executeStatementNode(child);
          }
        }
        return;
      }

      if (node.type === 'simple') {
        const stmt = node.text;
        const lineNum = node.lineNum;

        // Print statement
        if (stmt.startsWith('print(')) {
          const inside = stmt.slice(6, -1);
          let endChar = '\n';
          let printArg = inside;
          if (inside.includes('end=')) {
            const parts = inside.split('end=');
            printArg = parts[0].replace(/,\s*$/, '').trim();
            endChar = evalPyExpr(parts[1].trim(), lineNum);
          }

          let outVal = '';
          if (printArg) {
            outVal = String(evalPyExpr(printArg, lineNum));
          }

          const fullOutput = outVal + endChar;
          stdout.push(fullOutput);

          if (endChar === '\n') {
            if (outVal === '') {
              isPatternMode = true;
              const r = variables.i !== undefined ? variables.i : patternTracker.currentRow;
              patternTracker.newLine(r);
              emitStep(lineNum, 'print_newline', `print(): Advanced to next line.`);
            } else {
              emitStep(lineNum, 'print', `print(): Output ${JSON.stringify(outVal)}.`);
            }
          } else {
            isPatternMode = true;
            const r = variables.i !== undefined ? variables.i : 0;
            for (const ch of outVal) {
              patternTracker.printChar(ch, r, { i: variables.i, j: variables.j });
            }
            emitStep(lineNum, 'print_char', `print(): Output symbol '${outVal}'.`);
          }
          return;
        }

        // List method: arr.append(val)
        const appendMatch = /^([a-zA-Z_]\w*)\.append\((.*)\)$/.exec(stmt);
        if (appendMatch) {
          const listName = appendMatch[1];
          const val = evalPyExpr(appendMatch[2], lineNum);
          if (!Array.isArray(variables[listName])) variables[listName] = [];
          variables[listName].push(val);
          const idx = variables[listName].length - 1;
          emitStep(lineNum, 'list_append', `${listName}.append(${val}): Added element at index [${idx}].`, { modifiedIndices: [idx] });
          return;
        }

        // List method: arr.pop()
        const popMatch = /^([a-zA-Z_]\w*)\.pop\((.*?)\)$/.exec(stmt);
        if (popMatch) {
          const listName = popMatch[1];
          const list = variables[listName];
          if (Array.isArray(list) && list.length > 0) {
            const arg = popMatch[2].trim();
            if (arg === '0') {
              const popped = list.shift();
              emitStep(lineNum, 'queue_dequeue', `${listName}.pop(0): Dequeued ${popped}.`);
            } else {
              const popped = list.pop();
              emitStep(lineNum, 'stack_pop', `${listName}.pop(): Popped ${popped} from stack.`);
            }
          }
          return;
        }

        // List index assignment: arr[i] = val
        const listAssignMatch = /^([a-zA-Z_]\w*)\[(.*?)\]\s*=\s*(.*)$/.exec(stmt);
        if (listAssignMatch) {
          const listName = listAssignMatch[1];
          const idx = evalPyExpr(listAssignMatch[2], lineNum);
          const val = evalPyExpr(listAssignMatch[3], lineNum);
          if (Array.isArray(variables[listName])) {
            variables[listName][idx] = val;
            emitStep(lineNum, 'list_update', `Updated ${listName}[${idx}] = ${val}.`, { modifiedIndices: [idx] });
            return;
          }
        }

        // Member assignment: node.next = val
        const memAssignMatch = /^([a-zA-Z_]\w*)\.(data|val|next|left|right)\s*=\s*(.*)$/.exec(stmt);
        if (memAssignMatch) {
          const objName = memAssignMatch[1];
          const field = memAssignMatch[2];
          const val = evalPyExpr(memAssignMatch[3], lineNum);
          const nid = variables[objName];
          if (nid && heap[nid]) {
            heap[nid][field] = val;
            emitStep(lineNum, 'pointer_update', `Updated ${objName}.${field} = ${val}.`, { modifiedNodes: [nid] });
            return;
          }
        }

        // Augmented assignment: sum += arr[i]
        const augMatch = /^([a-zA-Z_]\w*)\s*(\+=|-=|\*=)\s*(.*)$/.exec(stmt);
        if (augMatch) {
          const varName = augMatch[1];
          const op = augMatch[2];
          const delta = evalPyExpr(augMatch[3], lineNum);
          const cur = variables[varName] || 0;
          const res = op === '+=' ? cur + delta : (op === '-=' ? cur - delta : cur * delta);
          variables[varName] = res;
          emitStep(lineNum, 'var_update', `Updated variable '${varName}' ${op} ${delta} -> ${res}.`);
          return;
        }

        // Simple assignment: x = val
        const assignMatch = /^([a-zA-Z_]\w*)\s*=\s*(.*)$/.exec(stmt);
        if (assignMatch) {
          const varName = assignMatch[1];
          const val = evalPyExpr(assignMatch[2], lineNum);
          variables[varName] = val;
          emitStep(lineNum, 'var_assign', `Assigned variable '${varName}' = ${Array.isArray(val) ? `[${val.join(', ')}]` : val}.`);
          return;
        }
      }
    }

    const astBlocks = parsePyBlocks(lines);
    for (const block of astBlocks) {
      executeStatementNode(block);
    }

    return {
      success: true,
      ds_type: isPatternMode ? 'pattern' : ('root' in variables ? 'bst' : ('head' in variables ? 'linked_list' : 'array')),
      trace,
      error: null
    };
  }

  // ==========================================================================
  // 3. JAVA 17 ENGINE (PARSER & TRACING INTERPRETER)
  // ==========================================================================

  function extractJavaMainBody(code) {
    const mainIdx = code.indexOf('main');
    if (mainIdx === -1) return code;
    const braceStart = code.indexOf('{', mainIdx);
    if (braceStart === -1) return code;

    let depth = 1;
    let i = braceStart + 1;
    while (i < code.length && depth > 0) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}') depth--;
      i++;
    }
    return code.slice(braceStart + 1, i - 1);
  }

  function executeJava(codeStr) {
    const bodyCode = extractJavaMainBody(codeStr);

    // Map Java constructs to C equivalent
    const mapped = bodyCode
      .replace(/System\.out\.println\((.*?)\);/g, 'printf("%d\\n", $1);')
      .replace(/System\.out\.println\(\);/g, 'printf("\\n");')
      .replace(/System\.out\.print\((.*?)\);/g, 'printf("%s", $1);')
      .replace(/int\[\]\s+([a-zA-Z_]\w*)\s*=\s*new\s+int\[(.*?)\];/g, 'int $1[$2];')
      .replace(/int\[\]\s+([a-zA-Z_]\w*)\s*=\s*\{([^}]+)\};/g, 'int $1[] = {$2};')
      .replace(/boolean\s+/g, 'int ')
      .replace(/String\s+/g, 'char* ');

    const wrappedC = `
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};

int main() {
${mapped}
    return 0;
}
`;

    try {
      const tokens = tokenizeC(wrappedC);
      const parser = new CParser(tokens);
      const ast = parser.parse();
      const interpreter = new CInterpreter(ast);
      const trace = interpreter.run();
      const dsType = interpreter.getDsType();

      return {
        success: true,
        ds_type: dsType,
        trace,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        ds_type: null,
        trace: [],
        error: `Java Execution Error: ${err.message}`
      };
    }
  }

  // ==========================================================================
  // 4. PUBLIC DISPATCHER (C, PYTHON, JAVA)
  // ==========================================================================

  function executeCode(codeStr, language = 'c') {
    if (!codeStr || !codeStr.trim()) {
      return {
        success: false,
        ds_type: null,
        trace: [],
        error: "Validation Error: Source code cannot be empty."
      };
    }

    const lang = (language || 'c').toLowerCase();

    try {
      if (lang === 'python') {
        return executePython(codeStr);
      } else if (lang === 'java') {
        return executeJava(codeStr);
      } else {
        // C99 Execution
        const tokens = tokenizeC(codeStr);
        const parser = new CParser(tokens);
        const ast = parser.parse();
        const interpreter = new CInterpreter(ast);
        const trace = interpreter.run();
        const dsType = interpreter.getDsType();

        return {
          success: true,
          ds_type: dsType,
          trace,
          error: null
        };
      }
    } catch (err) {
      if (err instanceof ParseError) {
        return { success: false, ds_type: null, trace: [], error: `Syntax Error: ${err.message}` };
      }
      if (err instanceof RuntimeErrorEx) {
        return { success: false, ds_type: null, trace: [], error: `Runtime Error: ${err.message}` };
      }
      return { success: false, ds_type: null, trace: [], error: `Execution Error: ${err.message}` };
    }
  }

  return {
    tokenizeC,
    CParser,
    CInterpreter,
    executePython,
    executeJava,
    executeCode
  };
});
