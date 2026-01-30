import React, { useState } from 'react';
import { OrganizationRule } from '../types';
import { DEFAULT_RULES } from '../utils/photoOrganizer';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Settings,
  FileText,
  Folder
} from 'lucide-react';

interface RuleManagerProps {
  rules: OrganizationRule[];
  onRulesChange: (rules: OrganizationRule[]) => void;
  onClose: () => void;
}

interface EditingRule extends Omit<OrganizationRule, 'pattern'> {
  patternString: string;
}

function RuleManager({ rules, onRulesChange, onClose }: RuleManagerProps) {
  const [editingRule, setEditingRule] = useState<EditingRule | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [testString, setTestString] = useState('');

  const createEmptyRule = (): EditingRule => ({
    id: `rule-${Date.now()}`,
    name: '',
    patternString: '',
    folder: '',
    priority: 5,
    description: ''
  });

  const handleAddNew = () => {
    setEditingRule(createEmptyRule());
    setIsAddingNew(true);
  };

  const handleEdit = (rule: OrganizationRule) => {
    setEditingRule({
      ...rule,
      patternString: rule.pattern.source
    });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!editingRule) return;

    try {
      const newRule: OrganizationRule = {
        ...editingRule,
        pattern: new RegExp(editingRule.patternString, 'i')
      };

      if (isAddingNew) {
        onRulesChange([...rules, newRule]);
      } else {
        onRulesChange(rules.map(r => r.id === editingRule.id ? newRule : r));
      }

      setEditingRule(null);
      setIsAddingNew(false);
    } catch (error) {
      alert('Invalid regular expression pattern');
    }
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      onRulesChange(rules.filter(r => r.id !== ruleId));
    }
  };

  const handleCancel = () => {
    setEditingRule(null);
    setIsAddingNew(false);
  };

  const handleReset = () => {
    if (confirm('This will reset all rules to default. Continue?')) {
      onRulesChange([...DEFAULT_RULES]);
    }
  };

  const testPattern = (patternString: string, testStr: string): boolean => {
    try {
      const regex = new RegExp(patternString, 'i');
      return regex.test(testStr);
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Organization Rules</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rules List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Current Rules</h3>
                <div className="flex space-x-2">
                  <button onClick={handleReset} className="btn-secondary text-sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </button>
                  <button onClick={handleAddNew} className="btn-primary text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {rules
                  .sort((a, b) => b.priority - a.priority)
                  .map((rule) => (
                  <div key={rule.id} className="card border-l-4 border-blue-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Folder className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{rule.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Priority: {rule.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                        <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                          {rule.pattern.source}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          → {rule.folder}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rule Editor */}
            <div className="space-y-4">
              {editingRule ? (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {isAddingNew ? 'Add New Rule' : 'Edit Rule'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rule Name
                      </label>
                      <input
                        type="text"
                        value={editingRule.name}
                        onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2023 Photos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Folder
                      </label>
                      <input
                        type="text"
                        value={editingRule.folder}
                        onChange={(e) => setEditingRule({...editingRule, folder: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2023 Photos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pattern (Regular Expression)
                      </label>
                      <input
                        type="text"
                        value={editingRule.patternString}
                        onChange={(e) => setEditingRule({...editingRule, patternString: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        placeholder="^2023\d{4}_\d{6}_.*\.(jpg|png)$"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority (1-20)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={editingRule.priority}
                        onChange={(e) => setEditingRule({...editingRule, priority: parseInt(e.target.value) || 5})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editingRule.description}
                        onChange={(e) => setEditingRule({...editingRule, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder="Describe what this rule matches..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button onClick={handleSave} className="btn-success flex-1">
                        <Save className="h-4 w-4 mr-1" />
                        Save Rule
                      </button>
                      <button onClick={handleCancel} className="btn-secondary flex-1">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a rule to edit, or add a new one</p>
                </div>
              )}

              {/* Pattern Tester */}
              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-3">Test Pattern</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter filename to test (e.g., 20230615_142530_photo.jpg)"
                  />
                  
                  {testString && editingRule && (
                    <div className="flex items-center space-x-2">
                      {testPattern(editingRule.patternString, testString) ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-700">Pattern matches!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="text-red-700">Pattern doesn't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Help */}
              <div className="card bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Pattern Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use <code>^</code> for start of filename, <code>$</code> for end</li>
                  <li>• <code>\d</code> matches digits, <code>.*</code> matches anything</li>
                  <li>• <code>(jpg|png)</code> matches either jpg or png</li>
                  <li>• Higher priority rules are checked first</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RuleManager;
