// src/components/RuleManager.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';     // assuming shadcn/ui or similar
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus } from 'lucide-react';   // assuming lucide-react icons

// Define a simple Rule type (adjust to match your actual data structure)
interface Rule {
  id: string;
  name: string;
  condition: string;    // e.g. "price > 100" or regex pattern
  action: string;       // e.g. "notify", "block", "tag"
  active: boolean;
}

const initialRules: Rule[] = [
  {
    id: '1',
    name: 'High Value Alert',
    condition: 'price > 500',
    action: 'send email',
    active: true,
  },
  {
    id: '2',
    name: 'Block Spam Keywords',
    condition: 'contains "viagra" OR "lottery"',
    action: 'block',
    active: false,
  },
];

export default function RuleManager() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [newRuleName, setNewRuleName] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newAction, setNewAction] = useState('');

  const handleAddRule = () => {
    if (!newRuleName.trim() || !newCondition.trim() || !newAction.trim()) return;

    const newRule: Rule = {
      id: Date.now().toString(),
      name: newRuleName.trim(),
      condition: newCondition.trim(),
      action: newAction.trim(),
      active: true,
    };

    setRules((prev) => [...prev, newRule]);
    setNewRuleName('');
    setNewCondition('');
    setNewAction('');
  };

  const handleDeleteRule = (id: string) => {
    // This was the line causing the ESLint no-restricted-globals error
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules((prev) => prev.filter((rule) => rule.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  // Optional: placeholder for edit (you can expand this)
  const handleEditRule = (id: string) => {
    alert(`Edit functionality for rule ${id} - implement as needed`);
    // Would typically open a modal or inline form
  };

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Rule Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new rule form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rule Name</label>
              <Input
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. High Value Alert"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g. price > 100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Input
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g. notify admin"
              />
            </div>
            <Button onClick={handleAddRule} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>

          {/* Rules list */}
          <div className="space-y-4">
            {rules.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No rules yet. Add one above!
              </p>
            ) : (
              rules.map((rule) => (
                <Card key={rule.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            rule.active ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {rule.condition} → {rule.action}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(rule.id)}
                          title={rule.active ? 'Deactivate' : 'Activate'}
                        >
                          {rule.active ? 'Active' : 'Inactive'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRule(rule.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
