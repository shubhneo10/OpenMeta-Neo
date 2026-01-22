import { Button, Select, Spin } from 'antd';
import { PlusOutlined, RobotOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/PageHeader/PageHeader.component';
import { Category, PrimitiveItem, PrimitivesData } from './PrimitivesPage.interface';
import './primitives-page.less';

const PrimitivesPage: FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('atoms');
  const [selectedPrimitive, setSelectedPrimitive] = useState<PrimitiveItem | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string>('atoms');
  
  // Form states for Generate Atom
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string[]>([]);

  // State for content loading
  const [atomContent, setAtomContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);

  // State for generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generatedAtom, setGeneratedAtom] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Define the primitives data structure
  const primitivesData: PrimitivesData = {
    atoms: [
      {
        key: 'atom-x',
        label: 'Atom X',
        description: 'Asset Class Context - Wealth Management',
        contentPath: '/atoms/atom-x.yaml',
      },
      {
        key: 'atom-y',
        label: 'Atom Y',
        description: 'Investment Goal Context - Wealth Management',
        contentPath: '/atoms/atom-y.yaml',
      },
    ],
    molecules: [
      {
        key: 'molecule-1',
        label: 'Molecule 1',
        description: 'Combination of atoms forming a molecule',
      },
      {
        key: 'molecule-2',
        label: 'Molecule 2',
        description: 'Another molecular component',
      },
    ],
    compounds: [
      {
        key: 'compound-1',
        label: 'Compound 1',
        description: 'Complex component combining molecules',
      },
      {
        key: 'compound-2',
        label: 'Compound 2',
        description: 'Another compound structure',
      },
    ],
  };

  const categories: Category[] = useMemo(
    () => [
      {
        key: 'atoms',
        label: t('label.atoms'),
        icon: '⚛️',
        items: primitivesData.atoms,
      },
      {
        key: 'molecules',
        label: t('label.molecules'),
        icon: '🧬',
        items: primitivesData.molecules,
      },
      {
        key: 'compounds',
        label: t('label.compounds'),
        icon: '🔬',
        items: primitivesData.compounds,
      },
    ],
    [t]
  );

  const selectedCategoryData = useMemo(
    () => categories.find((cat) => cat.key === selectedCategory),
    [selectedCategory, categories]
  );

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategory(expandedCategory === categoryKey ? '' : categoryKey);
    setSelectedCategory(categoryKey);
  };

  const handlePrimitiveClick = (primitive: PrimitiveItem) => {
    setSelectedPrimitive(primitive);
    
    // Load content if contentPath is available
    if (primitive.contentPath) {
      setContentLoading(true);
      fetch(primitive.contentPath)
        .then((response) => response.text())
        .then((content) => {
          // Display raw YAML content as-is
          setAtomContent(content);
          setContentLoading(false);
        })
        .catch((error) => {
          console.error('Error loading content:', error);
          setAtomContent('Error loading content');
          setContentLoading(false);
        });
    }
  };

  const generationSteps = [
    { text: 'Analyzing table structures...', type: 'step' },
    { text: 'Understanding your data schema...', type: 'thinking' },
    { text: 'Identifying entity relationships...', type: 'step' },
    { text: 'Generating semantic mappings...', type: 'step' },
    { text: 'Refining context definitions...', type: 'thinking' },
    { text: 'Creating atom configuration...', type: 'step' },
    { text: 'Optimizing for performance...', type: 'step' },
    { text: 'Finalizing generated atom...', type: 'step' },
  ];

  const handleGenerateAtom = async () => {
    setIsGenerating(true);
    setGeneratedAtom('');
    setGenerationStep(0);

    try {
      // Simulate sequential step display with delays
      for (let i = 0; i < generationSteps.length; i++) {
        const step = generationSteps[i];
        await new Promise((resolve) => setTimeout(resolve, step.type === 'thinking' ? 2500 : 2000)); // Longer for thinking
        setGenerationStep(i + 1);
      }

      // Call the API after all steps are complete
      const response = await fetch(
        'https://mocki.io/v1/2ea1a0df-b603-462f-82a0-29317592a631',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Format the JSON response beautifully
        const formattedAtom = JSON.stringify(data, null, 2);
        setGeneratedAtom(formattedAtom);
        // Auto-close generation UI after 1 second
        setTimeout(() => {
          setIsGenerating(false);
        }, 1000);
      } else {
        setGeneratedAtom('Error generating atom. Please try again.');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error generating atom:', error);
      setGeneratedAtom('Error generating atom. Please check the network.');
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedAtom);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="primitives-page">
      <PageHeader
        data={{
          header: t('label.available-primitives'),
          subHeader: t('message.view-all-available-primitives'),
        }}
      />

      <div className="primitives-container">
        {/* Left Sidebar - Categories */}
        <div className="primitives-sidebar">
          <div className="sidebar-title">
            <span className="title-text">{t('label.primitives')}</span>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <div key={category.key} className="category-section">
                <div
                  className={`category-item ${
                    selectedCategory === category.key ? 'active' : ''
                  }`}
                  onClick={() => toggleCategory(category.key)}>
                  <div className="category-main">
                    <button
                      className="expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.key);
                      }}>
                      {expandedCategory === category.key ? '▼' : '▶'}
                    </button>
                    <span className="item-icon">{category.icon}</span>
                    <span className="item-name">{category.label}</span>
                  </div>
                  <span className="item-count">{category.items.length}</span>
                </div>

                {/* Expanded sublist */}
                {expandedCategory === category.key && (
                  <div className="sublist">
                    {category.items.map((item) => (
                      <div
                        key={item.key}
                        className={`sublist-item ${
                          selectedPrimitive?.key === item.key ? 'selected' : ''
                        }`}
                        onClick={() => handlePrimitiveClick(item)}>
                        <span className="sublist-icon">◆</span>
                        <span className="sublist-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Content Detail */}
        <div className="primitives-detail-panel">
          {selectedPrimitive ? (
            <>
              <div className="detail-header">
                <h2 className="detail-title">{selectedPrimitive.label}</h2>
                <button
                  className="close-btn"
                  onClick={() => setSelectedPrimitive(null)}>
                  ×
                </button>
              </div>

              <div className="detail-content">
                {contentLoading ? (
                  <div className="content-loading">
                    <Spin />
                  </div>
                ) : atomContent ? (
                  <div className="markdown-content">
                    <pre className="markdown-pre" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{atomContent}</pre>
                  </div>
                ) : (
                  <>
                    <div className="detail-section">
                      <div className="section-label">KEY</div>
                      <div className="section-value">{selectedPrimitive.key}</div>
                    </div>

                    <div className="detail-section">
                      <div className="section-label">DESCRIPTION</div>
                      <div className="section-value">
                        {selectedPrimitive.description || 'No description available'}
                      </div>
                    </div>

                    <div className="detail-section">
                      <div className="section-label">TYPE</div>
                      <div className="section-value">
                        {selectedCategoryData?.label || 'Unknown'}
                      </div>
                    </div>

                    <div className="detail-section">
                      <div className="section-label">PROPERTIES</div>
                      <div className="properties-table">
                        <div className="prop-row">
                          <div className="prop-key">Category:</div>
                          <div className="prop-val">
                            {selectedCategoryData?.label}
                          </div>
                        </div>
                        <div className="prop-row">
                          <div className="prop-key">Name:</div>
                          <div className="prop-val">{selectedPrimitive.label}</div>
                        </div>
                        <div className="prop-row">
                          <div className="prop-key">Identifier:</div>
                          <div className="prop-val">{selectedPrimitive.key}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : isGenerating ? (
            <div className="initial-screen-form">
              <div className="generation-container">
                <div className="generation-header">
                  <RobotOutlined className="generation-icon" />
                  <h2 className="generation-title">Generating Atoms</h2>
                  <p className="generation-subtitle">
                    AI is analyzing your tables and creating atoms
                  </p>
                </div>

                <div className="generation-steps">
                  {generationSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`generation-step ${step.type} ${
                        generationStep > index
                          ? 'completed'
                          : generationStep === index
                          ? 'in-progress'
                          : 'pending'
                      }`}>
                      <div className="step-indicator">
                        {generationStep > index ? (
                          <div className="step-completed">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#52c41a" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                        ) : generationStep === index ? (
                          step.type === 'thinking' ? (
                            <div className="ai-thinking-loader">
                              <div className="thinking-dot"></div>
                              <div className="thinking-dot"></div>
                              <div className="thinking-dot"></div>
                            </div>
                          ) : (
                            <div className="ai-loader">
                              <div className="loader-bar"></div>
                              <div className="loader-bar"></div>
                              <div className="loader-bar"></div>
                            </div>
                          )
                        ) : (
                          <div className="step-pending">{index + 1}</div>
                        )}
                      </div>
                      <div className="step-content">
                        <p className="step-text">{step.text}</p>
                        {step.type === 'thinking' && generationStep === index && (
                          <p className="step-badge">AI Thinking</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="generation-progress">
                  <div
                    className="progress-bar"
                    style={{ 
                      '--progress-width': `${(generationStep / generationSteps.length) * 100}%` 
                    } as React.CSSProperties & { '--progress-width': string }}
                  />
                </div>
                <p className="progress-text">
                  Step {generationStep} of {generationSteps.length}
                </p>
              </div>
            </div>
          ) : generatedAtom ? (
            <div className="initial-screen-form">
              <div className="generation-result">
                <div className="result-header">
                  <h2 className="result-title">Atom Generated Successfully! 🎉</h2>
                </div>

                <div className="result-content">
                  <div className="code-header">
                    <span className="code-label">JSON Response</span>
                    <Button
                      type="text"
                      size="small"
                      icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={handleCopyToClipboard}
                      className="copy-button"
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="result-code">{generatedAtom}</pre>
                </div>

                <div className="result-actions">
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      setGeneratedAtom('');
                      setSelectedDatabase(null);
                      setSelectedSchema(null);
                      setSelectedTable([]);
                    }}>
                    Generate Another Atom
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="initial-screen-form">
              <div className="form-container">
                <div>
                  <span className="form-title">Generate New Atom</span>
                  <span className="form-subtitle">
                    Select database, schema, and tables to generate atoms
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Database</label>
                  <Select
                    placeholder="Select a database"
                    value={selectedDatabase}
                    onChange={setSelectedDatabase}
                    options={[
                      { label: 'advisory_services_db', value: 'advisory_services_db' },
                      { label: 'market_data_db', value: 'market_data_db' },
                      { label: 'portfolio_management_db', value: 'portfolio_management_db' },
                    ]}
                    status={!selectedDatabase ? 'warning' : undefined}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Schema</label>
                  <Select
                    placeholder="Select a schema"
                    value={selectedSchema}
                    onChange={setSelectedSchema}
                    disabled={!selectedDatabase}
                    options={
                      selectedDatabase === 'portfolio_management_db'
                        ? [
                            { label: 'customers_portfolio', value: 'customers_portfolio' },
                            { label: 'marketing_analytics', value: 'marketing_analytics' },
                            { label: 'sales_analytics', value: 'sales_analytics' },
                          ]
                        : [
                            { label: `${selectedDatabase}_schema_1`, value: `${selectedDatabase}_schema_1` },
                            { label: `${selectedDatabase}_schema_2`, value: `${selectedDatabase}_schema_2` },
                          ]
                    }
                    status={selectedDatabase && !selectedSchema ? 'warning' : undefined}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tables</label>
                  <Select
                    placeholder="Select a table"
                    value={selectedTable.length > 0 ? selectedTable[0] : undefined}
                    onChange={(value) => setSelectedTable(value ? [value] : [])}
                    disabled={!selectedSchema}
                    options={
                      selectedSchema === 'customers_portfolio'
                        ? [
                            { label: 'investor_profiles', value: 'investor_profiles' },
                            { label: 'investment_goals', value: 'investment_goals' },
                            { label: 'portfolio_holdings', value: 'portfolio_holdings' },
                            { label: 'goal_tracking', value: 'goal_tracking' },
                            { label: 'goal_performance', value: 'goal_performance' },
                            { label: 'goal_risk_metrics', value: 'goal_risk_metrics' },
                            { label: 'cash_flows', value: 'cash_flows' },
                            { label: 'portfolio_health', value: 'portfolio_health' },
                            { label: 'sector_allocation', value: 'sector_allocation' },
                            { label: 'scenario_based_rebalancing', value: 'scenario_based_rebalancing' },
                            { label: 'sector', value: 'sector' },
                            { label: 'segment', value: 'segment' },
                            { label: 'category', value: 'category' },
                            { label: 'investment_type', value: 'investment_type' },
                          ]
                        : [
                            { label: `${selectedSchema}_table_1`, value: `${selectedSchema}_table_1` },
                            { label: `${selectedSchema}_table_2`, value: `${selectedSchema}_table_2` },
                          ]
                    }
                    status={selectedSchema && selectedTable.length === 0 ? 'warning' : undefined}
                  />
                </div>

                {selectedDatabase && selectedSchema && selectedTable.length > 0 && (
                  <>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      block
                      onClick={handleGenerateAtom}
                      loading={isGenerating}>
                      Generate Atoms for {selectedTable.length} Table{selectedTable.length !== 1 ? 's' : ''}
                    </Button>
                    <div className="form-footer">
                      {selectedTable.length} table{selectedTable.length !== 1 ? 's' : ''} selected • Ready to generate atoms
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimitivesPage;
