
import { useState } from 'react';

const sampleCode = `#include <iostream>
#include <vector>
#include <string>

// Example C++ code with AI comments
class AICompiler {
private:
    std::vector<std::string> tokens;
    bool optimized;

public:
    AICompiler() : optimized(false) {}

    // Tokenize the input code
    void tokenize(const std::string& code) {
        // AI optimization: Using smart tokenization
        tokens.clear();
        std::string current;
        
        for (char c : code) {
            if (c == ' ' || c == '\\n' || c == '\\t') {
                if (!current.empty()) {
                    tokens.push_back(current);
                    current.clear();
                }
            } else {
                current += c;
            }
        }
        
        if (!current.empty()) {
            tokens.push_back(current);
        }
    }

    // Optimize the tokenized code
    void optimize() {
        // AI enhancement: Apply advanced optimization patterns
        optimized = true;
        std::cout << "Code optimized by AI" << std::endl;
    }

    // Compile the optimized code
    bool compile() {
        if (!optimized) {
            optimize();
        }
        
        // AI-powered compilation process
        for (const auto& token : tokens) {
            // Process each token
        }
        
        return true;
    }
};

int main() {
    AICompiler compiler;
    std::string code = "// Your code here";
    
    compiler.tokenize(code);
    bool success = compiler.compile();
    
    if (success) {
        std::cout << "Compilation successful!" << std::endl;
    }
    
    return 0;
}`;

const CodeEditor = () => {
  const [code, setCode] = useState(sampleCode);
  
  const lines = code.split('\n');
  
  return (
    <div className="code-editor h-full font-mono relative overflow-auto">
      <div className="absolute top-2 right-2 flex gap-2">
        <div className="text-xs py-1 px-2 bg-muted rounded text-muted-foreground">main.cpp</div>
      </div>
      <pre className="text-sm leading-6 pt-8">
        {lines.map((line, i) => (
          <div key={i} className="hover:bg-muted/20">
            <span className="line-number">{i + 1}</span>
            {line.replace(/\/\/ (AI.*?):(.*)$/g, '// <span class="text-primary">$1</span>:<span class="text-secondary">$2</span>')}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default CodeEditor;
