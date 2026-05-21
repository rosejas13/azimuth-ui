'use client';

import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './TreeList.module.css';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'onToggle'> {
  data: TreeNode[];
  defaultExpanded?: string[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  onToggle?: (node: TreeNode, expanded: boolean) => void;
  /** @default false */
  showLines?: boolean;
}

function flattenTree(
  data: TreeNode[],
  expanded: Set<string>,
): { node: TreeNode; level: number; parentId: string | null }[] {
  const result: { node: TreeNode; level: number; parentId: string | null }[] = [];
  const walk = (nodes: TreeNode[], level: number, parentId: string | null) => {
    for (const node of nodes) {
      result.push({ node, level, parentId });
      if (node.children && node.children.length > 0 && expanded.has(node.id)) {
        walk(node.children, level + 1, node.id);
      }
    }
  };
  walk(data, 0, null);
  return result;
}

function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export const TreeList = forwardRef<HTMLDivElement, TreeListProps>(
  (
    {
      data,
      defaultExpanded,
      selectedId: controlledSelected,
      onSelect,
      onToggle,
      showLines = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState<Set<string>>(
      new Set(defaultExpanded ?? []),
    );
    const [internalSelected, setInternalSelected] = useState<string | null>(
      null,
    );
    const isControlled = controlledSelected !== undefined;
    const selectedId = isControlled ? controlledSelected : internalSelected;

    const rootRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    useImperativeHandle(ref, () => rootRef.current!);

    const toggle = useCallback(
      (node: TreeNode) => {
        setExpanded((prev) => {
          const next = new Set(prev);
          if (next.has(node.id)) {
            next.delete(node.id);
            onToggle?.(node, false);
          } else {
            next.add(node.id);
            onToggle?.(node, true);
          }
          return next;
        });
      },
      [onToggle],
    );

    const select = useCallback(
      (node: TreeNode) => {
        if (node.disabled) return;
        if (!isControlled) {
          setInternalSelected(node.id);
        }
        onSelect?.(node);
      },
      [isControlled, onSelect],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const flatNodes = flattenTree(data, expanded);
        const currentIndex = flatNodes.findIndex(
          (fn) => fn.node.id === selectedId,
        );
        const current = currentIndex >= 0 ? flatNodes[currentIndex] : null;

        let nextIndex = currentIndex;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (flatNodes.length === 0) break;
            nextIndex =
              currentIndex < 0
                ? 0
                : Math.min(currentIndex + 1, flatNodes.length - 1);
            {
              const next = flatNodes[nextIndex];
              select(next.node);
              nodeRefs.current.get(next.node.id)?.focus();
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (flatNodes.length === 0) break;
            nextIndex =
              currentIndex < 0
                ? flatNodes.length - 1
                : Math.max(currentIndex - 1, 0);
            {
              const next = flatNodes[nextIndex];
              select(next.node);
              nodeRefs.current.get(next.node.id)?.focus();
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (current && current.node.children?.length) {
              if (!expanded.has(current.node.id)) {
                toggle(current.node);
              } else {
                const next = flatNodes[currentIndex + 1];
                if (next) {
                  select(next.node);
                  nodeRefs.current.get(next.node.id)?.focus();
                }
              }
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (current) {
              if (
                current.node.children?.length &&
                expanded.has(current.node.id)
              ) {
                toggle(current.node);
              } else if (current.parentId) {
                const parentNode = findNodeById(data, current.parentId);
                if (parentNode) {
                  select(parentNode);
                  nodeRefs.current.get(parentNode.id)?.focus();
                }
              }
            }
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (current) {
              if (current.node.children?.length) {
                toggle(current.node);
              }
              select(current.node);
            } else if (flatNodes.length > 0) {
              select(flatNodes[0].node);
              nodeRefs.current.get(flatNodes[0].node.id)?.focus();
            }
            break;
          case 'Home':
            e.preventDefault();
            if (flatNodes.length > 0) {
              const first = flatNodes[0];
              select(first.node);
              nodeRefs.current.get(first.node.id)?.focus();
            }
            break;
          case 'End':
            e.preventDefault();
            if (flatNodes.length > 0) {
              const last = flatNodes[flatNodes.length - 1];
              select(last.node);
              nodeRefs.current.get(last.node.id)?.focus();
            }
            break;
        }
      },
      [data, expanded, selectedId, select, toggle],
    );

    const renderNode = useCallback(
      (node: TreeNode, level: number) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expanded.has(node.id);
        const isSelected = selectedId === node.id;

        return (
          <div
            key={node.id}
            ref={(el) => {
              if (el) {
                nodeRefs.current.set(node.id, el);
              } else {
                nodeRefs.current.delete(node.id);
              }
            }}
            role="treeitem"
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
            aria-level={level + 1}
            tabIndex={isSelected ? 0 : -1}
            className={cn(
              styles.node,
              isSelected && styles.nodeSelected,
              node.disabled && styles.nodeDisabled,
            )}
            style={{
              paddingLeft: `calc(var(--azimuth-space-sm) + ${level} * var(--azimuth-space-lg))`,
            }}
            onClick={() => select(node)}
            data-node-id={node.id}
          >
            {hasChildren ? (
              <button
                type="button"
                className={cn(
                  styles.arrow,
                  isExpanded && styles.arrowExpanded,
                )}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(node);
                }}
              >
                ▸
              </button>
            ) : (
              <span className={styles.noArrow} />
            )}
            {node.icon && <span className={styles.icon}>{node.icon}</span>}
            <span className={styles.label}>{node.label}</span>
          </div>
        );
      },
      [expanded, selectedId, select, toggle, handleKeyDown],
    );

    const renderTree = useCallback(
      (nodes: TreeNode[], level: number): React.ReactNode => {
        return nodes.map((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expanded.has(node.id);

          return (
            <div key={node.id} role="group">
              {renderNode(node, level)}
              {hasChildren && isExpanded && (
                <div
                  className={cn(styles.group, styles.groupExpanded)}
                >
                  {renderTree(node.children!, level + 1)}
                </div>
              )}
            </div>
          );
        });
      },
      [expanded, renderNode],
    );

    return (
      <div
        ref={rootRef}
        className={cn(styles.root, showLines && styles.lines, className)}
        role="tree"
        aria-label="Tree"
        tabIndex={selectedId ? -1 : 0}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {renderTree(data, 0)}
      </div>
    );
  },
);

TreeList.displayName = 'TreeList';
