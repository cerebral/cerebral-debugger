import './styles.css'

import Inspector from '../../../Inspector'

function Props({
  isExpanded,
  payload = {},
  pathClicked,
  onExpand,
  onCollapse,
}) {
  return (
    <div className="action-props">
      <div className="action-propsValue">
        <Inspector
          onExpand={onExpand}
          onCollapse={onCollapse}
          value={payload}
          pathClicked={pathClicked}
          expandedPaths={isExpanded ? [''] : []}
        />
      </div>
    </div>
  )
}

export default Props
