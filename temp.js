<div className="text-red-600 font-medium">
                                                            <div>Order Delivery Failed</div>
                                                            {(() => {
                                                                // Lấy lý do từ state hoặc localStorage
                                                                const reason = failureReasons[delivery.id] || 
                                                                    (() => {
                                                                        try {
                                                                            const saved = JSON.parse(localStorage.getItem("deliveryFailureReasons") || "{}");
                                                                            return saved[delivery.id];
                                                                        } catch (e) {
                                                                            return null;
                                                                        }
                                                                    })();
                                                                
                                                                return reason ? (
                                                                    <div className="text-sm text-gray-600 mt-1">
                                                                        <strong>Lý do:</strong> {reason}
                                                                    </div>
                                                                ) : null;
                                                            })()}
                                                        </div>

                                                        369 