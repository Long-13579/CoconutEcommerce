
            {/* Failure Reason Modal */}
            {showFailureModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowFailureModal(false)}></div>
                  <div className="relative bg-white rounded shadow-lg w-full max-w-md mx-4 p-6">
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold">Lý do giao hàng thất bại</h2>
                          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowFailureModal(false)}>×</button>
                      </div>
                      
                      <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Chọn lý do thất bại:</label>
                          <select 
                              className="w-full p-2 border rounded"
                              value={failureReason}
                              onChange={(e) => setFailureReason(e.target.value)}
                          >
                              <option value="">-- Chọn lý do --</option>
                              <option value="Người nhận sai địa chỉ">Người nhận sai địa chỉ</option>
                              <option value="Người nhận không nhận đơn hàng">Người nhận không nhận đơn hàng</option>
                              <option value="Địa chỉ không tồn tại">Địa chỉ không tồn tại</option>
                              <option value="Không liên lạc được người nhận">Không liên lạc được người nhận</option>
                              <option value="Sản phẩm bị hỏng trong quá trình vận chuyển">Sản phẩm bị hỏng trong quá trình vận chuyển</option>
                              <option value="other">Lý do khác</option>
                          </select>
                      </div>
                      
                      {failureReason === "other" && (
                          <div className="mb-4">
                              <label className="block text-sm font-medium mb-2">Nhập lý do khác:</label>
                              <textarea
                                  className="w-full p-2 border rounded"
                                  rows="3"
                                  value={customReason}
                                  onChange={(e) => setCustomReason(e.target.value)}
                                  placeholder="Nhập lý do thất bại..."
                              />
                          </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                          <button 
                              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                              onClick={() => setShowFailureModal(false)}
                          >
                              Hủy
                          </button>
                          <button 
                              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                              onClick={confirmFailedDelivery}
                          >
                              Xác nhận thất bại
                          </button>
                      </div>
                  </div>
              </div>
          )}