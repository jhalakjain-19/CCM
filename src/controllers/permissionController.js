class permissionController {
  static handleResponse(res, status, message, data = null) {
    console.log(status);

    res.status(status).json({
      status,
      message,
      data,
    });
  }
  static async setPermissionByUserId(req, res, next) {
    try {
      const { user_id } = req.params;
      const { permission } = req.body;

      if (!user_id || !permission) {
        return res
          .status(400)
          .json({ error: "User ID and permission are required." });
      }

      const isUpdated = await UserService.setPermissionByUserId(
        user_id,
        permission
      );

      if (!isUpdated) {
        return res
          .status(404)
          .json({ error: "User not found or permission not updated." });
      }

      res.status(200).json({
        message: "Permission updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
