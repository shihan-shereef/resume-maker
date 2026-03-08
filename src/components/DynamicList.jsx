import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const DynamicList = ({ sectionName, renderItem, emptyItem }) => {
    const { resumeData, addItem, removeItem, reorderList } = useResume();
    const items = resumeData[sectionName];

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        reorderList(sectionName, result.source.index, result.destination.index);
    };

    return (
        <div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={sectionName}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                marginBottom: '12px',
                                                display: 'flex',
                                                gap: '12px',
                                                boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.5)' : 'none',
                                                transition: snapshot.isDragging ? 'none' : 'box-shadow 0.2s'
                                            }}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                style={{ cursor: 'grab', display: 'flex', alignItems: 'flex-start', paddingTop: '10px' }}
                                            >
                                                <GripVertical size={20} color="var(--text-secondary)" />
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                {renderItem(item, index)}
                                            </div>

                                            <button
                                                onClick={() => removeItem(sectionName, item.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    paddingTop: '10px'
                                                }}
                                                title="Remove Item"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button
                onClick={() => addItem(sectionName, emptyItem)}
                className="btn-secondary"
                style={{ width: '100%', marginTop: '8px', borderStyle: 'dashed' }}
            >
                <Plus size={18} /> Add New Entry
            </button>
        </div>
    );
};

export default DynamicList;
