USE [lifelinedev]
GO

/****** Object:  Index [PK_dbo.UserResourceBands]    Script Date: 11/17/2015 1:38:37 PM ******/
ALTER TABLE [dbo].[UserResourceBands] ADD  CONSTRAINT [PK_dbo.UserResourceBands] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

